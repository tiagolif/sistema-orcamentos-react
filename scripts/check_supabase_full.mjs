import fs from 'fs';
const envPath = new URL('../.env', import.meta.url);
const envRaw = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envRaw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) { console.error('Env missing'); process.exit(2); }
const endpoint = `${url}/rest/v1/composicoes?select=*&limit=1`;
console.log('Endpoint:', endpoint);
const res = await fetch(endpoint, { headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' } });
console.log('Status:', res.status);
const data = await res.json();
console.log('Record keys:', Object.keys(data[0] || {}));
console.log('Record sample:', JSON.stringify(data[0], null, 2));
