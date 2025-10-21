import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Ajuste o caminho se necessário

// Import custom UI components
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function WorkForm() {
  const [clients, setClients] = useState([]);
  const [workData, setWorkData] = useState({
    client_id: '',
    name: '',
    type: '',
    status: 'Planejamento', // Alterado para seleção
    address: '',
    technical_manager: '',
    area_sqm: '',
    start_date: '',
    end_date: '',
    valor_contrato: '',
    custo_estimado: '',
    status_faturamento: 'A Faturar',
    numero_art_rrt: '',
    link_documentos: '',
    percentual_conclusao: 0,
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome_completo, razao_social')
        .order('nome_completo', { ascending: true });

      if (error) {
        setError('Não foi possível carregar os clientes.');
        console.error('Erro ao buscar clientes:', error);
      } else {
        setClients(data);
      }
    };

    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('Salvando...');
    setError('');

    // Garante que campos vazios sejam enviados como null para o Supabase
    const newWork = Object.fromEntries(
      Object.entries(workData).map(([key, value]) => [key, value === '' ? null : value])
    );

    const { error: insertError } = await supabase.from('obras').insert([newWork]);

    if (insertError) {
      setError(`Erro ao salvar a obra: ${insertError.message}`);
      setStatus('');
    } else {
      setStatus('Obra salva com sucesso!');
      setTimeout(() => navigate('/obras'), 1500);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-8"> {/* form-container */}
      <h2 className="text-lg mt-0 mb-6 text-center">Cadastro de Nova Obra</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="mb-6"> {/* form-section */}
          <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Informações Principais</p> {/* form-section-title */}
          <div className="grid grid-cols-12 gap-4"> {/* form-grid */}
            <div className="flex flex-row items-center gap-2 col-span-6"> {/* form-group col-span-6 */}
              <label htmlFor="client_id" className="text-sm font-medium flex-shrink-0">Cliente</label>
              <select id="client_id" name="client_id" value={workData.client_id} onChange={handleChange} required className="flex-1 min-w-0 py-2 px-3 text-base border border-gray-200 rounded-md bg-gray-50 transition-all duration-200 ease-in-out font-poppins text-gray-700 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/20">
                <option value="">Selecione um Cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.nome_completo || client.razao_social}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row items-center gap-2 col-span-6"> {/* form-group col-span-6 */}
              <label htmlFor="name" className="text-sm font-medium flex-shrink-0">Nome da Obra</label>
              <Input id="name" name="name" type="text" placeholder="Ex: Residência Unifamiliar" value={workData.name} onChange={handleChange} required />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-6"> {/* form-group col-span-6 */}
              <label htmlFor="type" className="text-sm font-medium flex-shrink-0">Tipo de Obra</label>
              <Input id="type" name="type" type="text" placeholder="Ex: Construção, Reforma" value={workData.type} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-6"> {/* form-group col-span-6 */}
              <label htmlFor="status" className="text-sm font-medium flex-shrink-0">Status da Obra</label>
              <select id="status" name="status" value={workData.status} onChange={handleChange} className="flex-1 min-w-0 py-2 px-3 text-base border border-gray-200 rounded-md bg-gray-50 transition-all duration-200 ease-in-out font-poppins text-gray-700 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/20">
                <option value="Planejamento">Planejamento</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Pausada">Pausada</option>
                <option value="Concluída">Concluída</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
            <div className="flex flex-row items-center gap-2 col-span-6"> {/* form-group col-span-6 */}
              <label htmlFor="numero_art_rrt" className="text-sm font-medium flex-shrink-0">Nº ART/RRT</label>
              <Input id="numero_art_rrt" name="numero_art_rrt" type="text" placeholder="Número do documento" value={workData.numero_art_rrt} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="mb-6"> {/* form-section */}
          <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Localização e Medidas</p> {/* form-section-title */}
          <div className="grid grid-cols-12 gap-4"> {/* form-grid */}
            <div className="flex flex-row items-center gap-2 col-span-8"> {/* form-group col-span-8 */}
              <label htmlFor="address" className="text-sm font-medium flex-shrink-0">Endereço da Obra</label>
              <Input id="address" name="address" type="text" placeholder="Rua, Nº, Bairro..." value={workData.address} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-4"> {/* form-group col-span-4 */}
              <label htmlFor="area_sqm" className="text-sm font-medium flex-shrink-0">Área (m²)</label>
              <Input id="area_sqm" name="area_sqm" type="number" step="0.01" placeholder="Ex: 150.5" value={workData.area_sqm} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="mb-6"> {/* form-section */}
          <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Detalhes Financeiros</p> {/* form-section-title */}
          <div className="grid grid-cols-12 gap-4"> {/* form-grid */}
            <div className="flex flex-row items-center gap-2 col-span-4"> {/* form-group col-span-4 */}
              <label htmlFor="valor_contrato" className="text-sm font-medium flex-shrink-0">Valor do Contrato</label>
              <Input id="valor_contrato" name="valor_contrato" type="number" step="0.01" placeholder="R$" value={workData.valor_contrato} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-4"> {/* form-group col-span-4 */}
              <label htmlFor="custo_estimado" className="text-sm font-medium flex-shrink-0">Custo Estimado</label>
              <Input id="custo_estimado" name="custo_estimado" type="number" step="0.01" placeholder="R$" value={workData.custo_estimado} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-4"> {/* form-group col-span-4 */}
              <label htmlFor="status_faturamento" className="text-sm font-medium flex-shrink-0">Status do Faturamento</label>
              <select id="status_faturamento" name="status_faturamento" value={workData.status_faturamento} onChange={handleChange} className="flex-1 min-w-0 py-2 px-3 text-base border border-gray-200 rounded-md bg-gray-50 transition-all duration-200 ease-in-out font-poppins text-gray-700 focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/20">
                <option value="A Faturar">A Faturar</option>
                <option value="Faturado Parcialmente">Faturado Parcialmente</option>
                <option value="Faturado Totalmente">Faturado Totalmente</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6"> {/* form-section */}
          <p className="font-semibold text-lg text-text-primary mb-4 border-b border-gray-200 pb-1.5">Prazos e Responsáveis</p> {/* form-section-title */}
          <div className="grid grid-cols-12 gap-4"> {/* form-grid */}
            <div className="flex flex-row items-center gap-2 col-span-6"> {/* form-group col-span-6 */}
              <label htmlFor="start_date" className="text-sm font-medium flex-shrink-0">Data de Início</label>
              <Input id="start_date" name="start_date" type="date" value={workData.start_date} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-6"> {/* form-group col-span-6 */}
              <label htmlFor="end_date" className="text-sm font-medium flex-shrink-0">Data de Término</label>
              <Input id="end_date" name="end_date" type="date" value={workData.end_date} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-8"> {/* form-group col-span-8 */}
              <label htmlFor="technical_manager" className="text-sm font-medium flex-shrink-0">Responsável Técnico</label>
              <Input id="technical_manager" name="technical_manager" type="text" placeholder="Nome do engenheiro(a) ou arquiteto(a)" value={workData.technical_manager} onChange={handleChange} />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-4"> {/* form-group col-span-4 */}
              <label htmlFor="percentual_conclusao" className="text-sm font-medium flex-shrink-0">% Concluído</label>
              <Input id="percentual_conclusao" name="percentual_conclusao" type="number" min="0" max="100" step="1" placeholder="%" value={workData.percentual_conclusao} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="mb-6"> {/* form-section */}
          <p className="font-semibold text-lg text-gray-700 mb-4 border-b border-gray-200 pb-1.5">Documentação</p> {/* form-section-title */}
          <div className="grid grid-cols-12 gap-4"> {/* form-grid */}
            <div className="flex flex-row items-center gap-2 col-span-12"> {/* form-group col-span-12 */}
              <label htmlFor="link_documentos" className="text-sm font-medium flex-shrink-0">Link dos Documentos</label>
              <Input id="link_documentos" name="link_documentos" type="url" placeholder="https://..." value={workData.link_documentos} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6"> {/* form-actions */}
          <Link to="/obras" className="inline-block px-6 py-3 rounded-md font-semibold border border-accent text-accent transition-all duration-200 ease-in-out hover:bg-accent/10 hover:-translate-y-px">Voltar</Link>
          <Button type="submit" variant="primary">Salvar Obra</Button>
        </div>

        {status && <p className={`mt-4 ${error ? 'text-red-600' : 'text-green-600'}`}>{status || error}</p>}
        
      </form>
    </div>
  );
}
