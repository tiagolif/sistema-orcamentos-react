import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';

const ObraDetalhePage = () => {
  const { id } = useParams();
  const [obra, setObra] = useState(null);
  const [urlsDaGaleria, setUrlsDaGaleria] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchObraDetails = async () => {
      setError(null);

      // Fetch obra data with client details
      const { data: obraData, error: obraError } = await supabase
        .from('obras')
        .select(`
          *,
          clientes!cliente_id ( nome_completo, razao_social )
        `)
        .eq('id', id)
        .single();

      if (obraError) {
        setError(obraError.message);
        console.error('Error fetching obra:', obraError);
        return;
      }
      setObra(obraData);

      // List files in storage
      const { data: fileList, error: fileError } = await supabase
        .storage
        .from('documentos_obras')
        .list(id);

      if (fileError) {
        console.warn('Error listing files (or folder does not exist):', fileError.message);
        setUrlsDaGaleria([]);
      } else {
        // Generate signed URLs for each file
        const signedUrls = await Promise.all(
          (fileList || []).map(async (file) => {
            const filePath = `${id}/${file.name}`;
            const { data, error: signedUrlError } = await supabase.storage
              .from('documentos_obras')
              .createSignedUrl(filePath, 3600); // Link válido por 1 hora

            if (signedUrlError) {
              console.error(`Error creating signed URL for ${file.name}:`, signedUrlError);
              return { name: file.name, url: '#', error: true };
            }
            return { name: file.name, url: data.signedUrl };
          })
        );
        setUrlsDaGaleria(signedUrls.filter(url => !url.error));
      }
    };

    fetchObraDetails();
  }, [id]);

  if (error) {
    return <div className="p-6 text-red-500">Erro: {error}</div>;
  }

  if (!obra) {
    return <div className="p-6">Carregando...</div>;
  }

  const clienteNome = obra.clientes ? (obra.clientes.razao_social || obra.clientes.nome_completo) : 'N/A';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
        Detalhes da Obra: {obra.nome_obra}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div>
          <DetailSection title="Informações Principais">
            <DetailItem label="Nome da Obra" value={obra.nome_obra} />
            <DetailItem label="Cliente" value={clienteNome} />
            <DetailItem label="Status" value={obra.status_obra} />
          </DetailSection>
          <DetailSection title="Gestão e Prazos">
            <DetailItem label="Responsável Técnico" value={obra.responsavel_tecnico} />
            <DetailItem label="Centro de Custo" value={obra.centro_de_custo} />
            <DetailItem label="Data de Início" value={obra.data_inicio} />
            <DetailItem label="Data de Fim" value={obra.data_fim} />
          </DetailSection>
        </div>
        <div>
          <DetailSection title="Endereço da Obra">
            <DetailItem label="CEP" value={obra.cep} />
            <DetailItem label="Endereço" value={obra.endereco} />
            <DetailItem label="Cidade" value={obra.cidade} />
            <DetailItem label="Estado" value={obra.estado} />
          </DetailSection>
        </div>
      </div>

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
                  download={anexo.name}
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
        <Link to="/cadastros/obras">
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

export default ObraDetalhePage;
