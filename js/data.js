/**
 * Programa ARKA - Graphene Corp.
 * Base de dados local para notícias e contas de clientes
 */

const ARKA_DATA = {
    // Não contém mais dados hardcoded de clientes
    // Dados dos usuários agora estão em /auth/$USERNAME.js
    clients: [],

    // Notícias do portal público
    news: [
        {
            id: 1,
            category: "Geopolítica",
            title: "Tensões no Pacífico atingem nível crítico",
            summary: "Alianças militares se reposicionam enquanto negociações diplomáticas entram em colapso.",
            content: "As tensões geopolíticas na região do Pacífico atingiram um nível sem precedentes nas últimas 48 horas. Fontes militares confirmam o reposicionamento de frota navais estratégicas...",
            date: "2024-01-15",
            author: "Redação Internacional",
            featured: true
        },
        {
            id: 2,
            category: "Defesa Nacional",
            title: "Governo anuncia novo programa de defesa civil",
            summary: "Iniciativa visa preparar população para cenários de emergência em larga escala.",
            content: "O Ministério da Defesa revelou hoje um abrangente programa de preparação civil para situações de crise. O plano inclui diretrizes para abrigos, estoque de suprimentos...",
            date: "2024-01-14",
            author: "Correspondente de Defesa",
            featured: false
        },
        {
            id: 3,
            category: "Mercado Financeiro",
            title: "Bolsas internacionais registram volatilidade extrema",
            summary: "Investidores buscam refúgio em ativos seguros amid crescente incerteza global.",
            content: "Os principais índices bursáteis mundiais experimentaram oscilações bruscas nesta semana, refletindo a apreensão dos mercados diante do cenário geopolítico...",
            date: "2024-01-14",
            author: "Editoria de Economia",
            featured: false
        },
        {
            id: 4,
            category: "Conflitos Internacionais",
            title: "ONU convoca sessão de emergência sobre desarmamento nuclear",
            summary: "Especialistas alertam para risco iminente de escalada bélica sem precedentes.",
            content: "O Conselho de Segurança das Nações Unidas se reunirá em caráter extraordinário para discutir as crescentes ameaças nucleares trocadas entre potências globais...",
            date: "2024-01-13",
            author: "Correspondente na ONU",
            featured: true
        },
        {
            id: 5,
            category: "Guia de Sobrevivência",
            title: "Especialistas divulgam protocolos de abrigo para civis",
            summary: "Manual completo orienta população sobre medidas de proteção em caso de ataque.",
            content: "Um consórcio de especialistas em defesa civil publicou um guia detalhado com procedimentos recomendados para civis em situações de emergência extrema...",
            date: "2024-01-12",
            author: "Equipe de Sobrevivência",
            featured: false
        },
        {
            id: 6,
            category: "Tecnologia",
            title: "Graphene Corp. expande produção de cápsulas ARKA",
            summary: "Nova fábrica promete triplicar capacidade de preservação humana.",
            content: "A Graphene Corp. anunciou a inauguração de sua mais nova unidade de produção das cápsulas de hibernação ARKA. A tecnologia de ponta promete ser a única alternativa viável...",
            date: "2024-01-11",
            author: "Redação de Tecnologia",
            featured: false
        }
    ],

    // Notificações simuladas da cápsula
    capsuleNotifications: [
        {
            id: 1,
            type: "info",
            message: "Sistema de suporte vital operando em 98% de eficiência.",
            timestamp: "2024-01-15T08:30:00"
        },
        {
            id: 2,
            type: "warning",
            message: "Pré-despertar agendado para daqui a 72 horas.",
            timestamp: "2024-01-15T06:00:00"
        },
        {
            id: 3,
            type: "success",
            message: "Ciclo de hibernação completado com sucesso.",
            timestamp: "2024-01-14T22:00:00"
        },
        {
            id: 4,
            type: "error",
            message: "Flutuação detectada no sistema de temperatura. Estabilização automática ativada.",
            timestamp: "2024-01-14T18:45:00"
        }
    ]
};

// Export para uso nos outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ARKA_DATA;
}
