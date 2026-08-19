// Dataset unificado do ecossistema Graphene / Projeto Arka — ano 2058

const GRAPHENE_DATA = {
  year: 2058,
  founded: 2041,
  version: "ARKA-OS 9.4",

  threatLevel: "ELEVADO",

  capsuleModels: {
    "Arcturus MK-III": {
      isolationRating: "Nível 4",
      autonomyHours: 2160,
      material: "Compósito de Grafeno Carbon-X",
      pressure: "1.01 atm"
    },
    "Arcturus MK-IV": {
      isolationRating: "Nível 5",
      autonomyHours: 4320,
      material: "Compósito de Grafeno Carbon-X2",
      pressure: "1.01 atm"
    },
    "Arcturus MK-V": {
      isolationRating: "Nível 6",
      autonomyHours: 8760,
      material: "Malha de Grafeno Estratificado",
      pressure: "1.02 atm"
    }
  },

  // Estados possíveis de uma cápsula e como comunicá-los
  capsuleStates: {
    "Hibernando": { label: "HIBERNANDO", detail: "Suporte de vida ativo — biovitais estáveis", tone: "phosphor" },
    "Em Espera": { label: "EM ESPERA", detail: "Cápsula pronta — aguardando ativação do operador", tone: "brass" },
    "Desperto":  { label: "DESPERTO", detail: "Operador fora da cápsula — janela de exposição ativa", tone: "danger" }
  },

  ticker: [
    { text: "Cápsulas ARKA ativas em operação", value: "48.203", alert: false },
    { text: "Integridade média do grafeno", value: "99.2%", alert: false },
    { text: "Nível de ameaça global", value: "ELEVADO", alert: true },
    { text: "Novas unidades entregues (30 dias)", value: "1.114", alert: false },
    { text: "Zonas de contenção regional ativas", value: "12", alert: false },
    { text: "Tempo médio de ativação da cápsula", value: "38s", alert: false },
    { text: "Estações de manufatura Graphene", value: "6", alert: false }
  ]
};
