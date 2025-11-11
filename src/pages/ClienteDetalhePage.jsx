import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';

const ClienteDetalhePage = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [urlsDaGaleria, setUrlsDaGaleria] = useState([]); // Novo estado para URLs da galeria
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      setError(null); // Reset error on new fetch

      // Fetch client data
      const { data: clientData, error: clientError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single();

      if (clientError) {
        setError(clientError.message);
        console.error('Error fetching client:', clientError);
        return;
      }
      setClient(clientData);

      // List files in storage
      const { data: fileList, error: fileError } = await supabase
        .storage
        .from('documentos_clientes')
        .list(id);

      if (fileError) {
        console.warn('Error listing files (or folder does not exist):', fileError.message);
        setUrlsDaGaleria([]); // Ensure gallery is empty if there's an error
      } else {
        // Generate signed URLs for each file
        const signedUrls = await Promise.all(
          (fileList || []).map(async (file) => {
            const filePath = `${id}/${file.name}`;
            const { data, error: signedUrlError } = await supabase.storage
              .from('documentos_clientes')
              .createSignedUrl(filePath, 3600); // Link válido por 1 hora

            if (signedUrlError) {
              console.error(`Error creating signed URL for ${file.name}:`, signedUrlError);
              return { name: file.name, url: '#', error: true }; // Fallback for error
            }
            return { name: file.name, url: data.signedUrl };
          })
        );
        setUrlsDaGaleria(signedUrls.filter(url => !url.error)); // Filter out any failed URLs
      }
    };

    fetchClientDetails();
  }, [id]);

  if (error) {
    return <div className="p-6 text-red-500">Erro: {error}</div>;
  }

  if (!client) {
    return <div className="p-6">Carregando...</div>;
  }

  const isPj = client.tipo_pessoa === 'pj';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
        Detalhes do Cliente
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div>
          <DetailSection title={isPj ? "Dados da Empresa" : "Dados Pessoais"}>
            {isPj ? (
              <>
                <DetailItem label="Razão Social" value={client.razao_social} />
                <DetailItem label="Nome Fantasia" value={client.nome_fantasia} />
                <DetailItem label="CNPJ" value={client.cnpj} />
              </>
            ) : (
              <>
                <DetailItem label="Nome Completo" value={client.nome_completo} />
                <DetailItem label="CPF" value={client.cpf} />
              </>
            )}
          </DetailSection>
          {isPj && (
            <DetailSection title="Informações Fiscais">
              <DetailItem label="Inscrição Estadual" value={client.inscricao_estadual} />
              <DetailItem label="Inscrição Municipal" value={client.inscricao_municipal} />
            </DetailSection>
          )}
        </div>
        <div>
          <DetailSection title="Contato">
            {isPj && <DetailItem label="Pessoa de Contato" value={client.pessoa_contato} />}
            <DetailItem label="E-mail" value={client.email} />
            <DetailItem label="Telefone" value={client.telefone} />
          </DetailSection>
          <DetailSection title="Endereço">
            <DetailItem label="CEP" value={client.cep} />
            <DetailItem label="Logradouro" value={client.logradouro} />
            <DetailItem label="Número" value={client.numero} />
            <DetailItem label="Complemento" value={client.complemento} />
            <DetailItem label="Bairro" value={client.bairro} />
            <DetailItem label="Cidade" value={client.cidade} />
            <DetailItem label="UF" value={client.uf} />
          </DetailSection>
        </div>
      </div>

      <DetailSection title="Observações">
        <DetailItem label="Observações" value={client.observacoes} fullWidth />
      </DetailSection>

      <DetailSection title="Anexos Salvos">
        {urlsDaGaleria.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {urlsDaGaleria.map((anexo) => (
              <div key={anexo.name} className="border rounded-lg p-2 flex flex-col items-center justify-between">
                {anexo.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                  <img src={anexo.url} alt={anexo.name} className="w-full h-32 object-cover rounded-md mb-2" />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md mb-2 text-gray-500 text-sm text-center">
                    {anexo.name.split('.').pop().toUpperCase()}
                  </div>
                )}
                <a 
                  href={anexo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline text-sm text-center w-full truncate"
                  download={anexo.name} // Suggest download for non-image files
                >
                  {anexo.name}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum anexo encontrado.</p>
        )}
      </DetailSection>

      <div className="flex justify-end gap-4 mt-8">
        <Link to="/clientes">
          <Button variant="secondary">Voltar</Button>
        </Link>
      </div>
    </div>
  );
};

const DetailSection = ({ title, children }) => (
  <div className="mb-6">
    <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">{title}</p>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

const DetailItem = ({ label, value, fullWidth }) => (
  <div className={`flex ${fullWidth ? 'flex-col items-start' : 'flex-row items-center'}`}>
    <p className="text-sm font-medium text-gray-600 w-40 flex-shrink-0">{label}:</p>
    <p className="text-sm text-gray-800">{value || 'Não informado'}</p>
  </div>
);

export default ClienteDetalhePage;
