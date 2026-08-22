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

};

// Vocabulário e valores padrão da Ficha do Operador (inspirada em fichas de
// RPG de mesa, reinterpretada em chave futurista/corporativa).
const ARKA_SHEET_META = {
  proficiencyBonus: 2,

  operatorClasses: [
    "Engenheiro de Sobrevivência",
    "Comandante Tático",
    "Médico de Campo",
    "Especialista em Grafeno",
    "Analista de Sinais",
    "Batedor de Superfície"
  ],

  sectors: [
    "Setor 7 — Zona Neutra",
    "Setor 3 — Cinturão Industrial",
    "Setor 12 — Litoral Contido",
    "Setor 1 — Núcleo Corporativo",
    "Setor 9 — Fronteira Radioativa"
  ],

  attributes: [
    { key: "forca", label: "Força" },
    { key: "destreza", label: "Destreza" },
    { key: "resistencia", label: "Resistência" },
    { key: "intelecto", label: "Intelecto" },
    { key: "percepcao", label: "Percepção" },
    { key: "influencia", label: "Influência" }
  ],

  skills: [
    { key: "pilotagem", name: "Pilotagem", attr: "destreza" },
    { key: "combate", name: "Combate Corpo a Corpo", attr: "forca" },
    { key: "socorros", name: "Primeiros Socorros", attr: "resistencia" },
    { key: "hacking", name: "Hacking de Sistemas", attr: "intelecto" },
    { key: "tatica", name: "Análise Tática", attr: "percepcao" },
    { key: "negociacao", name: "Negociação", attr: "influencia" },
    { key: "sobrevivencia", name: "Sobrevivência", attr: "percepcao" },
    { key: "engenharia", name: "Engenharia de Grafeno", attr: "intelecto" }
  ],

  defaultSheet: function () {
    return {
      operatorClass: ARKA_SHEET_META.operatorClasses[0],
      sector: ARKA_SHEET_META.sectors[0],
      background: "",
      attributes: { forca: 10, destreza: 10, resistencia: 10, intelecto: 10, percepcao: 10, influencia: 10 },
      vitals: { integrity: 20, integrityMax: 20, shielding: 10, initiative: 0 },
      skills: ARKA_SHEET_META.skills.map((s) => ({ key: s.key, trained: false })),
      equipment: [
        { name: "Kit de Primeiros Socorros Nano", note: "Estabiliza biovitais em campo." }
      ],
      trait: "",
      motivation: "",
      bond: "",
      flaw: "",
      backstory: ""
    };
  }
};
