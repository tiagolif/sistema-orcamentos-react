import fs from 'fs';
import { setTimeout as wait } from 'timers/promises';

const envPath = new URL('../.env', import.meta.url);
const envRaw = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envRaw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Não foi possível ler VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY do .env');
  process.exit(2);
}

const endpoint = `${supabaseUrl}/rest/v1/composicoes?select=id,codigo,descricao,unidade,custo_total&limit=1`;
console.log('Tentando conectar a:', endpoint);

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 15000);

try {
  const res = await fetch(endpoint, {
    method: 'GET',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Accept: 'application/json'
    },
    signal: controller.signal
  });
  clearTimeout(timeout);
  console.log('Status:', res.status, res.statusText);
  const text = await res.text();
  console.log('Body length:', text.length);
  try {
    const data = JSON.parse(text);
    console.log('Resposta JSON (preview):', JSON.stringify(data.slice(0,3), null, 2));
  } catch (e) {
    console.log('Resposta não é JSON ou não pôde ser parseada');
  }
} catch (err) {
  if (err.name === 'AbortError') {
    console.error('Erro: request aborted por timeout (15s)');
  } else {
    console.error('Erro ao fetch:', err.message || err);
  }
  process.exit(1);
}
