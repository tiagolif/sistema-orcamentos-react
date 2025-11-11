import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Button from '../components/ui/Button';

const FornecedorDetalhePage = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      setError(null);
      // 1. Fetch supplier data
      const { data: supplierData, error: supplierError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .single();

      if (supplierError) {
        setError(supplierError.message);
        console.error('Error fetching supplier:', supplierError);
        return;
      }
      setSupplier(supplierData);

      // 2. List files in storage
      const { data: fileList, error: fileError } = await supabase
        .storage
        .from('documentos_fornecedores')
        .list(id);

      if (fileError) {
        console.error('Erro ao listar anexos:', fileError);
      } else {
        console.log('DEBUG: ANEXOS ENCONTRADOS:', fileList);
        setFiles(fileList);
      }
    };

    fetchSupplierDetails();
  }, [id]);

  const getFileUrl = (fileName) => {
    const { data } = supabase
      .storage
      .from('documentos_fornecedores')
      .getPublicUrl(`${id}/${fileName}`);
    return data.publicUrl;
  };

  if (error) {
    return <div className="p-6 text-red-500">Erro: {error}</div>;
  }

  if (!supplier) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
        Detalhes do Fornecedor
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        {/* Coluna Esquerda */}
        <div>
          <DetailSection title="Dados da Empresa">
            <DetailItem label="Razão Social" value={supplier.razao_social} />
            <DetailItem label="Nome Fantasia" value={supplier.nome_fantasia} />
            <DetailItem label="CNPJ" value={supplier.cnpj} />
          </DetailSection>
          <DetailSection title="Informações Fiscais">
            <DetailItem label="Inscrição Estadual" value={supplier.inscricao_estadual} />
            <DetailItem label="Inscrição Municipal" value={supplier.inscricao_municipal} />
          </DetailSection>
           <DetailSection title="Dados Financeiros">
            <DetailItem label="Banco" value={supplier.banco} />
            <DetailItem label="Agência" value={supplier.agencia} />
            <DetailItem label="Conta" value={supplier.conta} />
            <DetailItem label="Chave PIX" value={supplier.chave_pix} />
          </DetailSection>
        </div>
        {/* Coluna Direita */}
        <div>
          <DetailSection title="Contato">
            <DetailItem label="Pessoa de Contato" value={supplier.pessoa_contato} />
            <DetailItem label="E-mail" value={supplier.email} />
            <DetailItem label="Telefone" value={supplier.telefone} />
          </DetailSection>
          <DetailSection title="Endereço">
            <DetailItem label="CEP" value={supplier.cep} />
            <DetailItem label="Logradouro" value={supplier.logradouro} />
            <DetailItem label="Número" value={supplier.numero} />
            <DetailItem label="Complemento" value={supplier.complemento} />
            <DetailItem label="Bairro" value={supplier.bairro} />
            <DetailItem label="Cidade" value={supplier.cidade} />
            <DetailItem label="UF" value={supplier.uf} />
          </DetailSection>
        </div>
      </div>

      {/* Seções de Largura Total */}
      <DetailSection title="Classificação e Observações">
        <DetailItem label="Categoria" value={supplier.categoria} />
        <DetailItem label="Observações" value={supplier.observacoes} fullWidth />
      </DetailSection>

      <DetailSection title="Anexos Salvos">
        {files.length > 0 ? (
          <ul className="list-disc pl-5">
            {files.map(file => (
              <li key={file.id} className="mb-2">
                <a 
                  href={getFileUrl(file.name)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhum anexo encontrado.</p>
        )}
      </DetailSection>

      <div className="flex justify-end gap-4 mt-8">
        <Link to="/fornecedores">
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

export default FornecedorDetalhePage;
