const etapasPadrao = [
  {
    id: '01',
    name: 'Serviços Preliminares',
    children: [
      { id: '01.01', name: 'Limpeza do terreno' },
      { id: '01.02', name: 'Instalações Provisórias' },
      { id: '01.03', name: 'Tapumes e Placas de Obra' },
    ],
  },
  {
    id: '02',
    name: 'Infraestrutura',
    children: [
      { id: '02.01', name: 'Fundações' },
      { id: '02.02', name: 'Movimento de Terra' },
      { id: '02.03', name: 'Rede de Drenagem' },
    ],
  },
  {
    id: '03',
    name: 'Superestrutura',
    children: [
      { id: '03.01', name: 'Estrutura de Concreto' },
      { id: '03.02', name: 'Estrutura Metálica' },
    ],
  },
  {
    id: '04',
    name: 'Alvenaria e Fechamentos',
    children: [
      { id: '04.01', name: 'Paredes Internas' },
      { id: '04.02', name: 'Paredes Externas' },
    ],
  },
  {
    id: '05',
    name: 'Cobertura',
    children: [
      { id: '05.01', name: 'Estrutura do Telhado' },
      { id: '05.02', name: 'Telhas' },
      { id: '05.03', name: 'Calhas e Rufos' },
    ],
  },
  {
    id: '06',
    name: 'Instalações',
    children: [
      { id: '06.01', name: 'Instalações Hidráulicas' },
      { id: '06.02', name: 'Instalações Elétricas' },
      { id: '06.03', name: 'Instalações de Gás' },
      { id: '06.04', name: 'Instalações de Telecomunicações' },
    ],
  },
  {
    id: '07',
    name: 'Revestimentos',
    children: [
      { id: '07.01', name: 'Pisos' },
      { id: '07.02', name: 'Paredes' },
      { id: '07.03', name: 'Forros' },
    ],
  },
  {
    id: '08',
    name: 'Esquadrias',
    children: [
      { id: '08.01', name: 'Portas' },
      { id: '08.02', name: 'Janelas' },
      { id: '08.03', name: 'Portões' },
    ],
  },
  {
    id: '09',
    name: 'Pintura',
    children: [
      { id: '09.01', name: 'Preparação de Superfícies' },
      { id: '09.02', name: 'Pintura Interna' },
      { id: '09.03', name: 'Pintura Externa' },
    ],
  },
  {
    id: '10',
    name: 'Serviços Complementares e Acabamentos',
    children: [
      { id: '10.01', name: 'Louças e Metais' },
      { id: '10.02', name: 'Vidros' },
      { id: '10.03', name: 'Paisagismo' },
      { id: '10.04', name: 'Limpeza Final da Obra' },
    ],
  },
];

export default etapasPadrao;