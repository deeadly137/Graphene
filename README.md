# Graphene — Projeto Arka

Site institucional fictício da **Graphene Corporation**, ambientado em 2058. A empresa desenvolve o **Projeto Arka**: cápsulas pessoais de grafeno que preservam vidas humanas em hibernação diante da escalada nuclear global.

Site estático puro (HTML/CSS/JS, sem build step), pronto para publicação no **GitHub Pages**.

## Estrutura

```
├── index.html          Página inicial
├── about.html           Sobre a Graphene / história / valores
├── login.html            Acesso à cápsula (autenticação de demonstração)
├── dashboard.html    Painel do operador (requer login)
├── news.html            Central de comunicados + leitura de artigo completo
├── 404.html               Página de erro temática
├── css/main.css        Estilos globais
├── js/
│   ├── data.js            Constantes globais (, specs de cápsulas)
│   ├── users.js          Operadores cadastrados (dados de demonstração)
│   ├── auth.js            Sessão / autenticação (localStorage + sessionStorage)
│   ├── dashboard.js  Lógica do painel do operador
│   ├── news.js           Carregamento de notícias + visualização de artigo
│   └── main.js           Menu mobile, , revelação ao rolar
├── news/                    Conteúdo de notícias (manifest + preview/full por item)
└── logo.svg
```

## Publicar no GitHub Pages

1. Envie o conteúdo desta pasta para a branch principal do repositório (ou para `docs/`).
2. Em **Settings → Pages**, selecione a branch/pasta correspondente.
3. Não é necessário nenhum passo de build — é HTML/CSS/JS puro.

## Acesso de demonstração

A página de login valida usuário e senha contra os operadores em `js/users.js`. Há atalhos na própria tela de login para preencher automaticamente as credenciais de três operadores fictícios, além de um botão de "Acesso de Operador Visitante" que cria uma sessão temporária sem exigir credenciais.

> Este é um projeto de ficção/portfólio. Nenhum dado, empresa ou evento aqui descrito é real.
