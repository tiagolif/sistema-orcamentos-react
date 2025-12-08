import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';

const DiarioDeObrasPage = () => {
    const [allRdos, setAllRdos] = useState([]);
    const [filteredRdos, setFilteredRdos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRdos();
    }, []);

    useEffect(() => {
        handleFilter();
    }, [searchTerm, dateFilter, allRdos, filterStatus]);

    const fetchRdos = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('rdos')
            .select('*, clientes(nome_completo, razao_social)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Erro ao buscar RDOs:", error);
        } else {
            setAllRdos(data);
            setFilteredRdos(data);
        }
        setLoading(false);
    };

    const handleFilter = () => {
        let rdos = [...allRdos];

        if (filterStatus !== 'all') {
            rdos = rdos.filter(rdo => rdo.status === filterStatus);
        }

        if (dateFilter) {
            rdos = rdos.filter(rdo => rdo.created_at.startsWith(dateFilter));
        }

        if (searchTerm) {
            rdos = rdos.filter(rdo =>
                (rdo.clientes?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (rdo.clientes?.razao_social?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (rdo.equipe?.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredRdos(rdos);
    };

    const getStatusBadge = (rdo) => {
        switch (rdo.status) {
            case 'PENDENTE':
                return <span className="px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-full">⏳ PENDENTE</span>;
            case 'CONCLUIDO':
                return <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">✅ CONCLUÍDO</span>;
            default:
                const hasAditivo = rdo.is_aditivo_profundidade || rdo.is_aditivo_travessia;
                if (hasAditivo) {
                    return <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">COM ADITIVO</span>;
                }
                return <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">NORMAL</span>;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este RDO?')) {
            const { error } = await supabase.from('rdos').delete().eq('id', id);
            if (error) {
                alert(`Erro ao excluir RDO: ${error.message}`);
            } else {
                fetchRdos(); // Refresh
            }
        }
    };

    const handleEditar = (rdo) => {
        navigate('/mobile/rdo/novo', { state: { rdoEditar: rdo } });
    };

    const handlePDF = (rdo) => {
        const doc = new jsPDF();
        const hasAditivo = rdo.is_aditivo_profundidade || rdo.is_aditivo_travessia;

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text("RELATÓRIO DIÁRIO DE OBRA - HIDROSANTEC", 105, 20, null, null, "center");

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Data: ${new Date(rdo.created_at).toLocaleDateString('pt-BR')}`, 20, 40);
        doc.text(`Cliente: ${rdo.clientes?.nome_completo || rdo.clientes?.razao_social || 'N/A'}`, 20, 50);
        doc.text(`Equipe: ${rdo.equipe}`, 20, 60);
        doc.text(`Profundidade: ${rdo.profundidade}m`, 20, 70);

        if (hasAditivo) {
            doc.setTextColor(255, 0, 0);
            doc.text("Status: COM ADITIVO", 20, 80);
            doc.setTextColor(0, 0, 0);
        } else {
            doc.text("Status: NORMAL", 20, 80);
        }

        doc.save(`RDO-${rdo.id}.pdf`);
    };


    if (loading) {
        return <div className="p-6 text-center">Carregando RDOs...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestão de Diários de Obra</h1>
                <button 
                    onClick={() => navigate('/mobile/home')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-600 flex items-center"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Novo RDO
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Pesquisar por cliente ou equipe..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    />
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                    />
                </div>
                <div className="mt-4 flex space-x-2">
                    <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-lg ${filterStatus === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Todos</button>
                    <button onClick={() => setFilterStatus('PENDENTE')} className={`px-4 py-2 rounded-lg ${filterStatus === 'PENDENTE' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>Pendentes</button>
                    <button onClick={() => setFilterStatus('CONCLUIDO')} className={`px-4 py-2 rounded-lg ${filterStatus === 'CONCLUIDO' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Concluídos</button>
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Protocolo</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipe</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredRdos.map(rdo => (
                            <tr key={rdo.id} className="hover:bg-gray-50">
                                <td className="p-3 whitespace-nowrap text-sm">{rdo.numero_os || '-'}</td>
                                <td className="p-3 whitespace-nowrap text-sm">{new Date(rdo.created_at).toLocaleDateString('pt-BR')}</td>
                                <td className="p-3 whitespace-nowrap text-sm">{rdo.clientes?.nome_completo || rdo.clientes?.razao_social || 'N/A'}</td>
                                <td className="p-3 whitespace-nowrap text-sm">{rdo.equipe}</td>
                                <td className="p-3 whitespace-nowrap text-sm">{rdo.tipo_servico}</td>
                                <td className="p-3 whitespace-nowrap text-sm">{getStatusBadge(rdo)}</td>
                                <td className="p-3 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => navigate(`/rdo/visualizar/${rdo.id}`)} className="text-orange-500 hover:underline">Visualizar</button>
                                        <span>|</span>
                                        <button onClick={() => handleEditar(rdo)} className="text-orange-500 hover:underline">Editar</button>
                                        <span>|</span>
                                        <button onClick={() => handleDelete(rdo.id)} className="text-red-500 hover:underline">Excluir</button>
                                        <span>|</span>
                                        <button onClick={() => handlePDF(rdo)} className="text-green-600 hover:underline">Relatório</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredRdos.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Nenhum RDO encontrado para os filtros aplicados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiarioDeObrasPage;