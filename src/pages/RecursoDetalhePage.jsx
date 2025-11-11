import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';

const RecursoDetalhePage = () => {
  const { id } = useParams();
  const [recurso, setRecurso] = useState(null);
  const [urlsDaGaleria, setUrlsDaGaleria] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecursoDetails = async () => {
      setError(null);

      // Fetch recurso data
      const { data: recursoData, error: recursoError } = await supabase
        .from('recursos_humanos')
        .select('*')
        .eq('id', id)
        .single();

      if (recursoError) {
        setError(recursoError.message);
        console.error('Error fetching recurso:', recursoError);
        return;
      }
      setRecurso(recursoData);

      // List files in storage
      const { data: fileList, error: fileError } = await supabase
        .storage
        .from('documentos_recursos')
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
              .from('documentos_recursos')
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

    fetchRecursoDetails();
  }, [id]);

  if (error) {
    return <div className="p-6 text-red-500">Erro: {error}</div>;
  }

  if (!recurso) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
        Detalhes do Recurso: {recurso.nome_completo}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        <div>
          <DetailSection title="Informações Pessoais">
            <DetailItem label="Nome Completo" value={recurso.nome_completo} />
            <DetailItem label="CPF" value={recurso.cpf} />
            <DetailItem label="Função" value={recurso.funcao} />
          </DetailSection>
          <DetailSection title="Informações de Contato">
            <DetailItem label="Telefone" value={recurso.telefone} />
            <DetailItem label="E-mail" value={recurso.email} />
          </DetailSection>
        </div>
        <div>
          <DetailSection title="Informações de Contrato">
            <DetailItem label="Tipo de Contrato" value={recurso.tipo_contrato} />
            <DetailItem label="Custo/Hora" value={recurso.custo_hora ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recurso.custo_hora) : 'N/A'} />
            <DetailItem label="Custo/Diária" value={recurso.custo_diaria ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recurso.custo_diaria) : 'N/A'} />
            <DetailItem label="Data de Admissão" value={recurso.data_admissao ? new Date(recurso.data_admissao).toLocaleDateString('pt-BR') : 'N/A'} />
            <DetailItem label="Status" value={recurso.status} />
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
        <Link to="/cadastros/recursos">
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

export default RecursoDetalhePage;
