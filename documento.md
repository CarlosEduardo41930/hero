# Documentação Técnica - Sistema de Missões (Herói)

**Autor:** Carlos

**Data:** 2026

**Stack:** Node.js + Express + MySQL + React + Tailwind CSS

---

## Sumário

1. Visão Geral
2. Estrutura de Pastas
3. Tecnologias e Onde São Usadas
   1. Zod
   2. TanStack React Query
   3. Framer Motion
4. Fluxo do Código
   1. Fluxo de Inicialização
   2. Fluxo de Autenticação (Login)
   3. Fluxo de Criação de Herói
   4. Fluxo de Completar Missão
   5. Fluxo de Evolução de Nível
5. Caminho dos Dados (Detalhado)
   1. POST /cadastro
   2. POST /login
   3. GET /herois
   4. GET /heroi/:id
   5. POST /herois/adicionar
   6. DELETE /heroi/:id
   7. GET /herois/guildas
   8. GET /guilda
   9. POST /guilda/adicionar
   10. GET /missao
   11. POST /missao/adicionar
   12. PUT /missao/fechar/:id
   13. GET /heroi/:id/missoes
   14. POST /heroi/:heroiId/completar-missao/:missaoId
   15. GET /usuario/perfil
   16. PUT /usuario/perfil/atualizar
6. Banco de Dados
7. Backend
8. Frontend
9. Regras de Negócio

---

## 1. Visão Geral

Sistema de gerenciamento de heróis, guildas e missões inspirado em RPG. Permite que um usuário recrutador crie heróis, associe-os a guildas, crie missões e acompanhe a evolução de nível, ouro e XP de cada herói ao completar missões.

Fluxo principal:

- Usuário se cadastra e faz login
- Cria heróis e guildas
- Cria missões com recompensas (ouro, XP, títulos)
- Heróis completam missões e recebem recompensas
- O sistema processa level-up automaticamente e atualiza a guilda

---

## 2. Estrutura de Pastas

```
hero/
|
|-- package.json                  # Scripts para rodar back + front juntos
|
|-- back/
|   |-- server.js                 # Ponto de entrada do servidor Express
|   |-- .env                      # Variáveis de ambiente (banco, JWT)
|   |-- package.json              # Dependências do backend
|   |
|   |-- src/
|       |-- config/
|       |   |-- db.js             # Pool de conexão MySQL
|       |
|       |-- api/
|       |   |-- herois.json       # Tabela de ranks dos heróis (25 ranks)
|       |   |-- guildas.json      # Tabela de ranks das guildas (12 ranks)
|       |
|       |-- zod/
|       |   |-- useZod.js         # Schemas de validação (Zod)
|       |
|       |-- middlewares/
|       |   |-- useMiddlewares.js # Middleware de autenticação JWT
|       |
|       |-- model/
|       |   |-- useModel.js       # Todas as queries SQL (camada de dados)
|       |
|       |-- controllers/
|       |   |-- useControllers.js # Lógica de negócio (controllers)
|       |
|       |-- routes/
|           |-- userRota.js       # Definição das rotas da API
|
|-- front/
    |-- index.html                # HTML base
    |-- .env                      # URL da API (VITE_LINK_BASE_API)
    |-- package.json              # Dependências do frontend
    |
    |-- src/
        |-- main.jsx              # Ponto de entrada React (BrowserRouter)
        |-- App.jsx               # Roteamento (React Router + QueryClient)
        |-- style.css             # Estilos globais (import Tailwind)
        |
        |-- api/
        |   |-- validacao.js      # Instância Axios com interceptors
        |   |-- apisRotas.js      # Funções de chamada à API
        |
        |-- Paginas/
        |   |-- Login.jsx         # Página de login
        |   |-- Cadastro.jsx      # Página de cadastro
        |   |-- Perfil.jsx        # Página de perfil do usuário
        |   |-- Layout.jsx        # Layout com Nav + Outlet
        |   |-- AcessoNegado.jsx  # Página 403
        |
        |-- Componentes/
            |-- CardGuilda.jsx    # Card individual de guilda
            |-- Cards.jsx         # Card individual de herói
            |-- CriarGuildas.jsx  # Formulário de criação de guilda
            |-- CriarHeroi.jsx    # Formulário de criação de herói
            |-- CriarMissoes.jsx  # Formulário de criação de missão
            |-- Guildas.jsx       # Lista de guildas
            |-- Heroi.jsx         # Página de detalhes do herói
            |-- HeroiMissoes.jsx  # Missões do herói
            |-- Home.jsx          # Página inicial (lista de heróis)
            |-- Missoes.jsx       # Lista de missões
            |-- Nav.jsx           # Barra de navegação
```

---

## 3. Tecnologias e Onde São Usadas

### 3.1 Zod

**O que é:**

- Biblioteca de validação de dados com inferência de tipos.
- Versão usada: 4.4.3

**Onde é usado:**

- Backend: `back/src/zod/useZod.js` — define schemas que validam dados antes de salvar
- Backend: `useControllers.js` — chama `safeParse()` antes de cada INSERT/UPDATE
- Frontend: `CriarHeroi.jsx` — valida formulário antes de enviar
- Frontend: `CriarGuildas.jsx` — valida formulário antes de enviar
- Frontend: `CriarMissoes.jsx` — valida formulário antes de enviar
- Frontend: `Cadastro.jsx` — valida com refine para senhas iguais
- Frontend: `Perfil.jsx` — valida dados antes de atualizar

**Como funciona no backend:**

```js
exports.validacaoMissao = z.object({
  nome: z.coerce.string().min(1),
  pontos: z.coerce.number().int().optional(),
  ouro: z.coerce.number().int().min(0).optional(),
  limite_participantes: z.coerce.number().int().min(1)
});
```

```js
const validacao = z.validacaoMissao.safeParse(req.body);
if (!validacao.success) {
  return res.status(400).json({
    message: "Dados inválidos!",
    errors: validacao.error.issues
  });
}
```

**Como funciona no frontend:**

```js
const validacaoHeroi = z.object({
  nome: z.coerce.string().min(2),
  classe: z.enum(["guerreiro", "mago", ...]),
  nivel: z.coerce.number().min(1).max(300),
});
```

```js
const dadosValidos = validacaoHeroi.safeParse({...});
if (dadosValidos.success) {
  mutation.mutate(dadosValidos.data);
} else {
  setErro(Object.values(dadosValidos.error.flatten().fieldErrors).flat());
}
```

**Por que usar Zod:**

- Validação DUPLA (frontend + backend) = segurança total
- No frontend: mostra erros amigáveis ao usuário antes de enviar
- No backend: garante que dados inválidos NUNCA cheguem ao banco
- `safeParse()` não lança exceção, retorna `{ success, data, error }`
- `z.coerce` faz conversão automática (string "5" vira number 5)

### 3.2 TanStack React Query

**O que é:**

- Biblioteca de gerenciamento de estado assíncrono (cache, fetch, mutations).
- Versão usada: 5.101.0

**Onde é usado:**

| Local        | Arquivo            | Tipo       | Chave do cache |
| ------------ | ------------------ | ---------- | -------------- |
| Provider     | `App.jsx`          | QueryClientProvider | - |
| Busca        | `Home.jsx`         | useQuery   | `['herois']` |
| Busca        | `Heroi.jsx`        | useQuery   | `['personagem', id]` |
| Busca        | `CriarHeroi.jsx`   | useQuery   | `['guildas']` |
| Busca        | `Guildas.jsx`      | useQuery   | `['guildas']` |
| Busca        | `Perfil.jsx`       | useQuery   | `['perfil']` |
| Busca        | `Missoes.jsx`      | useQuery   | `['missoes']` |
| Busca        | `HeroiMissoes.jsx` | useQuery   | `['heroisMissoes', id]` |
| Mutation     | `Login.jsx`        | useMutation| - |
| Mutation     | `Cadastro.jsx`     | useMutation| - |
| Mutation     | `CriarHeroi.jsx`   | useMutation| - |
| Mutation     | `CriarGuildas.jsx` | useMutation| - |
| Mutation     | `CriarMissoes.jsx` | useMutation| - |
| Mutation     | `Missoes.jsx`      | useMutation| - |
| Mutation     | `Heroi.jsx`        | useMutation| - |
| Mutation     | `HeroiMissoes.jsx` | useMutation| - |
| Mutation     | `Perfil.jsx`       | useMutation| - |

**Como funciona - `useQuery` (buscar dados):**

```js
const { data, isLoading, error } = useQuery({
  queryKey: ['herois'],
  queryFn: apiMostrarHerois,
  enabled: !!token
});
```

O `queryKey` identifica o cache. Se outro componente usar a mesma chave, reutiliza os dados sem nova requisição.

**Como funciona - `useMutation` (enviar dados):**

```js
const mutation = useMutation({
  mutationFn: apiAdicionarHeroi,
  onSuccess: (dado) => {
    navigate('/teste');
  },
  onError: (error) => {
    setErro(mensagens);
  }
});
```

No submit:

```js
mutation.mutate(dadosValidos.data);
```

No botão:

```jsx
<button disabled={mutation.isPending}>
  {mutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
</button>
```

**Como funciona - invalidar cache:**

```js
const queryClient = useQueryClient();

const fecharMissao = useMutation({
  mutationFn: (id) => apiFecharMissao(id),
  onSuccess: () => {
    queryClient.invalidateQueries(["missoes"]);
  }
});
```

**Por que usa React Query:**

- Gerencia loading/error/sucesso automaticamente
- Cache inteligente: evita requisições duplicadas
- Refetch automático: dados sempre atualizados
- `enabled`: controle fino de quando buscar (ex: só com token)
- Substitui `useEffect + useState + fetch` manual

### 3.3 Framer Motion

**O que é:**

- Biblioteca de animações para React.
- Instalada via: `npm install framer-motion`

**Onde é usado:**

| Componente       | Tipo de animação                        | Propriedades |
| ---------------- | --------------------------------------- | ------------ |
| `Cards.jsx`      | Entrada + hover no card de herói        | `initial`, `animate`, `whileHover` |
| `CardGuilda.jsx` | Entrada + hover no card de guilda       | `initial`, `animate`, `whileHover` |
| `CriarHeroi.jsx` | Mensagens de erro aparecem/somem        | `AnimatePresence`, `initial`, `animate`, `exit` |
| `CriarGuildas.jsx` | Mensagens de erro aparecem/somem      | `AnimatePresence`, `initial`, `animate`, `exit` |
| `CriarMissoes.jsx` | Mensagens de erro aparecem/somem      | `AnimatePresence`, `initial`, `animate`, `exit` |
| `Missoes.jsx`    | Cards escalonados + menu + mensagens    | `delay: index * 0.05` |
| `Heroi.jsx`      | Página de detalhes com fade-in          | `initial`, `animate` |
| `HeroiMissoes.jsx` | Cards escalonados + mensagens         | `delay: index * 0.05`, `AnimatePresence` |
| `Login.jsx`      | Mensagem de erro                        | `AnimatePresence`, `spring` |
| `Cadastro.jsx`   | Mensagem de erro                        | `AnimatePresence`, `spring` |
| `Perfil.jsx`     | Mensagens de erro e sucesso             | `AnimatePresence`, `spring` |
| `AcessoNegado.jsx` | Card central com scale-in             | `initial`, `animate`, `spring` |

**Como funciona:**

`motion.div` substitui `<div>` com animação:

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  whileHover={{ scale: 1.03, y: -4 }}
>
  {/* conteúdo */}
</motion.div>
```

`AnimatePresence` anima elementos que somem do DOM:

```jsx
<AnimatePresence>
  {erro.length > 0 && (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {erro.map((msg, i) => <p key={i}>{msg}</p>)}
    </motion.div>
  )}
</AnimatePresence>
```

Entrada escalonada:

```jsx
{lista.map((m, index) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
  >
    {/* conteúdo */}
  </motion.div>
))}
```

**Tipos de transição usados:**

- `{ duration: 0.3 }` — Linear, 0.3 segundos
- `{ type: "spring", stiffness: 400, damping: 25 }` — Elástico (bounce suave)
- `{ delay: index * 0.05 }` — Escalonado (um atrás do outro)

**Por que usa Framer Motion:**

- Mensagens de erro/sucesso aparecem e desaparecem suavemente
- Cards de herói/guilda/missão têm feedback visual ao hover
- Páginas carregam com animação de entrada profissional
- `AnimatePresence` permite animar elementos que somem do DOM
- Não afeta lógica: apenas wrappers visuais em volta do conteúdo

---

## 4. Fluxo do Código

### 4.1 Fluxo de Inicialização

**Backend:**

1. `back/server.js`
   - Importa `express`, `cors` e `routes`
   - Configura CORS (permite requisições de qualquer origem)
   - Configura `express.json()` (parseia JSON do body)
   - Registra todas as rotas (`userRota.js`)
   - Inicia servidor na porta 418
   - Resultado: "Acesse http://localhost:418 para testar a API"

2. `back/src/config/db.js`
   - Lê variáveis do `.env` (`DB_HOST`, `DB_USER`, etc.)
   - Cria pool de conexões MySQL com `mysql2`
   - Exporta conexão com suporte a Promises
   - Resultado: Conexão pronta para ser usada pelo model

**Frontend:**

1. `front/src/main.jsx`
   - Importa `BrowserRouter` do `react-router-dom`
   - Importa `App.jsx`
   - Renderiza `<App />` dentro de `<BrowserRouter>` e `<StrictMode>`
   - Resultado: Aplicação React montada no `<div id="root">`

2. `front/src/App.jsx`
   - Cria `QueryClient` (TanStack)
   - Envolve tudo com `<QueryClientProvider>`
   - Define todas as rotas com `<Routes>` e `<Route>`
   - Resultado: Sistema de rotas funcionando

3. `front/src/api/validacao.js`
   - Cria instância Axios com `baseURL = VITE_LINK_BASE_API`
   - Request interceptor: adiciona token JWT no header `Authorization`
   - Response interceptor: se 403, limpa token e redireciona
   - Resultado: Todas as requisições passam por aqui

### 4.2 Fluxo de Autenticação (Login)

**Frontend** | **Backend**
------------ | ---------
`Login.jsx` | `userRota.js`
Captura email + senha | POST `/login`
Valida com Zod (client) | Chama `controller.login`
Envia via `useMutation` | 
`apiLogin({ email, senha })` | 
 | `useControllers.js` — `login()`
 | Busca usuário por email (`model.login(email)`)
 | Compara senha com bcrypt (`bcrypt.compare(senha, hash)`)
 | Se OK: gera JWT (`jwt.sign({usuario, id}, secret)`)
 | Retorna `{ token, dados }`

**Frontend onSuccess:**

- Salva token no `localStorage`
- Salva usuário no `localStorage`
- Navega para `/teste`
- Próxima requisição já vai com token no header (interceptor)

### 4.3 Fluxo de Criação de Herói

**Frontend** | **Backend**
------------ | ---------
`CriarHeroi.jsx` | `userRota.js`
Carrega guildas (`useQuery`) | POST `/herois/adicionar`
`apiGuildas() -> GET /herois/guildas` | Chama `controller.novoHeroi`
Preenche formulário | 
Valida com Zod (client) | 
Envia via `useMutation` | 
`apiAdicionarHeroi(dados)` | 
 | `useControllers.js` — `novoHeroi()`
 | Valida com Zod (backend)
 | Busca rank pelo nível
 | Salva herói no banco (`model.novoHeroi(...)`)

**Backend model:**
- `novoHeroi()` insere heroí com campos: `nome, guilda, classe, imagem, nivel, status, ouro, descricao, userId, rank.ordem`

**Frontend onSuccess:**

- Navega para `/teste`
- `Home.jsx` detecta query invalidada
- Recarrega lista
- Herói aparece no grid
- `Cards.jsx` renderiza o card do novo herói

### 4.4 Fluxo de Completar Missão

**Frontend** | **Backend**
------------ | ---------
`HeroiMissoes.jsx` | `userRota.js`
Clica "Completar Missão" | POST `/heroi/:heroiId/completar-missao/:missaoId`
Envia via `useMutation` | Chama `controller.completarMissao`
`apiCompletarMissao(heroiId, missaoId)` | 
 | `useControllers.js` — `completarMissao()`
 | Verificações:
 | - Herói pertence ao usuário?
 | - Missão existe e `expose='true'`?
 | - Herói já completou esta missão?
 | - Limite de participantes OK?
 | Cálculo de recompensas:
 | - `xps += missao.pontos`
 | - `ouro += missao.ouro`
 | Processa título:
 | - Missão tem título?
 | - Se não existe no banco, cria
 | - Se herói não tem, associa título ao herói
 | Processa level-up
 | Salva herói atualizado
 | Atualiza guilda se herói tem guilda
 | Registra conclusão no `heroi_missao`
 | Verifica limite de participantes e fecha missão se necessário

**Frontend onSuccess:**

- Mostra mensagem de sucesso com animação Framer Motion
- `queryClient.invalidateQueries(["heroisMissoes", "1"])`
  - Recarrega: missão sai de "Disponíveis", vai para "Concluídas"
- `setMensagem({ tipo: "sucesso", texto: res.data.message })`
  - Framer Motion anima a mensagem
- `setTimeout(() => setMensagem(null), 4000)

### 4.5 Fluxo de Evolução de Nível

A função `processarLevelUp(heroi)` executa em loop para processar múltiplos level-ups de uma vez.

**Entrada:** `{ nivel, xps, ouro, ordem }`

**Saída:** `{ nivel, xps, ouro, ordem }` (atualizados)

Fluxo:

- Busca rank atual em `herois.json` (onde `nivel >= nivel_min` e `nivel <= nivel_max`)
- Loop:
  - Se `xps < pontos_xps` do rank: para (não sobe)
  - Calcula `excesso = xps - pontos_xps`
  - Se `nivel < nivel_max`:
    - incrementa `nivel`
    - `xps = excesso`
    - volta para o loop
  - Se `nivel == nivel_max`:
    - se `ouro >= ouro_necessario`:
      - incrementa `nivel`
      - `xps = excesso`
      - `ouro -= ouro_necessario`
      - volta para o loop
    - se não:
      - `ouro += Math.ceil(excesso * 0.05)`
      - `xps = 0`
      - para
- Atualiza `ordem` baseado no novo rank

**Exemplo prático:**

Heroi: `nivel=9`, `xps=250`, `ouro=500`
Rank: `F-` (`nivel_min=1`, `nivel_max=9`, `pontos_xps=100`, `ouro_necessario=500`)

Passo 1:
- `xps (250) >= pontos_xps (100)` → sobe
- `excesso = 150`
- `nivel (9) == nivel_max (9)` → sim
- `ouro (500) >= ouro_necessario (500)` → sim
- `nivel = 10`, `xps = 150`, `ouro = 0`

Passo 2:
- Novo rank: `F` (`nivel_min=10`, `nivel_max=19`, `pontos_xps=200`)
- `xps (150) < pontos_xps (200)` → para

Resultado final: `nivel=10`, `xps=150`, `ouro=0`

---

## 5. Caminho dos Dados (Detalhado)

Esta seção documenta exatamente o caminho de cada dado, desde o clique no botão do frontend até o INSERT/SELECT/UPDATE/DELETE no banco MySQL.

### 5.1 POST /cadastro

- `Cadastro.jsx` coleta `nome_completo`, `nome_usuario`, `email`, `senha`, `confirmar`
- Valida com Zod no cliente
- Se sucesso, `mutation.mutate(dadosValidos.data)`
- `apisRotas.js` chama `apiCadastrar(dados)`
- `validacao.js` usa Axios sem token
- `POST http://localhost:418/cadastro`

No backend:

- `userRota.js` define `POST /cadastro` → `controller.cadastro`
- `useControllers.js` valida com Zod
- `useModel.js` verifica cadastro por email
- Se email existe, retorna 409
- Cria hash com `bcrypt.hashSync`
- Insere usuário no banco
- Gera JWT com `jwt.sign`
- Retorna token e `nome_usuario`
- Frontend salva token/usuario e navega para `/teste`

### 5.2 POST /login

- `Login.jsx` coleta `email`, `senha`
- Valida com Zod no cliente
- `mutation.mutate({ email, senha })`
- `apisRotas.js` chama `apiLogin(dados)`
- `validacao.js` usa Axios sem token
- `POST http://localhost:418/login`

No backend:

- `userRota.js` define `POST /login` → `controller.login`
- `useControllers.js` busca usuário por email
- Se não encontrado, retorna 404
- Compara senha com `bcrypt.compare`
- Se inválido, retorna 400
- Gera JWT e retorna token + dados
- Frontend salva token/usuario e navega para `/teste`

### 5.3 GET /herois

- `Home.jsx` carrega heróis via `useQuery`
- `queryKey: ['herois']`, `queryFn: apiMostrarHerois`, `enabled: !!token`
- `apisRotas.js` chama `apiMostrarHerois()`
- `validacao.js` adiciona `Authorization: Bearer <token>` no header
- `GET http://localhost:418/herois`

No backend:

- `userRota.js` define `GET /herois` com `token.verificaToken`
- `useMiddlewares.js` confirma token e preenche `req.user`
- `useControllers.js` chama `sql.herois(userId)`
- `useModel.js` executa SELECT com JOIN em `titulo`
- Busca rank por nível e adiciona `nome_rank`, `cor`, `titulos`, `pontos_xps`
- Também busca dados para painel do usuário
- Retorna heróis + dados de usuário
- `Home.jsx` renderiza `Cards` e estatísticas

### 5.4 GET /heroi/:id

- `Heroi.jsx` carrega detalhes via `useQuery`
- `queryKey: ['personagem', '1']`, `queryFn: () => heroi('1')`
- `GET http://localhost:418/heroi/1`
- `userRota.js` define `GET /heroi/:id`
- `verificaToken` garante autenticação
- `useControllers.js` chama `sql.heroi(id)`
- `useModel.js` faz SELECT com LEFT JOIN em `titulo`
- Busca rank por nível e enriquece dados
- Retorna objeto do herói
- `Heroi.jsx` exibe imagem, stats, títulos, botões e exclusão

### 5.5 POST /herois/adicionar

- `CriarHeroi.jsx` coleta dados do herói
- Valida com Zod no cliente
- `mutation.mutate(dadosValidos.data)`
- `POST http://localhost:418/herois/adicionar`

No backend:

- `userRota.js` define rota autenticada
- `useControllers.js` valida com Zod
- Busca rank pelo nível em `herois.json`
- Insere herói com `sql.novoHeroi(...)`
- Retorna mensagem de sucesso
- Frontend navega para `/teste`
- `Home.jsx` invalida query `['herois']`
- Novo herói aparece no grid

### 5.6 DELETE /heroi/:id

- `Heroi.jsx` confirma exclusão
- `excluirHeroi.mutate(id)`
- `DELETE http://localhost:418/heroi/1`

No backend:

- `userRota.js` define rota autenticada
- `useControllers.js` chama `sql.excluirHeroi(id)`
- `useModel.js` executa `DELETE FROM heroi WHERE id_heroi = ?`
- Se `affectedRows === 0`, retorna herói não encontrado
- Retorna mensagem de sucesso
- Frontend navega para `/teste`

### 5.7 GET /herois/guildas

- `CriarHeroi.jsx` carrega guildas para o select
- `queryKey: ['guildas']`, `queryFn: apiGuildas`
- `GET http://localhost:418/herois/guildas`

No backend:

- `userRota.js` define rota autenticada
- `useControllers.js` chama `sql.guildas(userId)`
- `useModel.js` faz SELECT com JOIN em `titulo`
- Se vazio, retorna `204 { message: "vazio" }`
- Caso contrário, retorna guildas
- `CriarHeroi.jsx` popula o select de guildas

### 5.8 GET /guilda

- `Guildas.jsx` carrega guildas via `useQuery`
- `GET http://localhost:418/guilda`

No backend:

- `userRota.js` define rota autenticada
- `useControllers.js` chama `sql.guildas(userId)`
- `useModel.js` faz SELECT com JOIN em `titulo`
- Calcula rank da guilda por pontos
- Retorna array de guildas com rank
- `Guildas.jsx` renderiza `CardGuilda`

### 5.9 POST /guilda/adicionar

- `CriarGuildas.jsx` coleta dados da guilda
- Valida com Zod no cliente
- `POST http://localhost:418/guilda/adicionar`

No backend:

- `userRota.js` define rota autenticada
- `useControllers.js` valida com Zod
- Busca rank inicial em `guildas.json`
- Insere guilda com `sql.novaGuilda(...)`
- Retorna mensagem de sucesso
- Frontend navega para `/guildas`

### 5.10 GET /missao

- `Missoes.jsx` carrega missões via `useQuery`
- `GET http://localhost:418/missao`

No backend:

- `userRota.js` define rota autenticada
- `useControllers.js` chama `sql.missoes(userId)`
- `useModel.js` seleciona missões com `expose = 'true'`
- Se vazio, retorna `204 { message: "vazio" }`
- Caso contrário, retorna lista de missões
- `Missoes.jsx` exibe cards com menu de ações

### 5.11 POST /missao/adicionar

- `CriarMissoes.jsx` coleta todos os campos da missão
- Valida com Zod no cliente
- `POST http://localhost:418/missao/adicionar`

No backend:

- `userRota.js` define rota autenticada
- `useControllers.js` valida com Zod
- `sql.novaMissao(...)` insere missão com `expose = 'true'`
- Retorna mensagem de sucesso
- Frontend navega para `/missoes`

### 5.12 PUT /missao/fechar/:id

- `Missoes.jsx` clica no menu "Fechar Missão"
- `fecharMissao.mutate(m.id_missao)`
- `PUT http://localhost:418/missao/fechar/3`

No backend:

- `userRota.js` define rota autenticada
- `useControllers.js` chama `sql.getMissaoDados(id)`
- Verifica se a missão pertence ao usuário
- `sql.fecharMissao(id, userId)` atualiza `expose = 'false'`
- Retorna mensagem de sucesso
- Frontend invalida query `['missoes']`
- Mensagem anima com Framer Motion

### 5.13 GET /heroi/:id/missoes

- `HeroiMissoes.jsx` carrega missões do herói
- `queryKey: ['heroisMissoes', '1']`
- `GET http://localhost:418/heroi/1/missoes`

No backend:

- `userRota.js` define rota autenticada
- `useControllers.js` chama `sql.getHeroiDados(id)` e `sql.getMissoesDisponiveisParaHeroi(id)`
- Verifica que o herói pertence ao usuário
- `sql.getMissoesCompletasPorHeroi(id)` retorna missões já concluídas
- Retorna `disponiveis` e `completas`
- `HeroiMissoes.jsx` renderiza ambas as listas

### 5.14 POST /heroi/:heroiId/completar-missao/:missaoId

- `HeroiMissoes.jsx` clica `Completar Missão`
- `apiCompletarMissao('1', '3')`
- `POST http://localhost:418/heroi/1/completar-missao/3`

No backend:

- `userRota.js` define rota autenticada
- `useControllers.js` processa `completarMissao()`
- Busca dados do herói e da missão
- Verifica exposição, limite e conclusão anterior
- Calcula `xps`, `ouro` e atualiza o herói
- Processa título:
  - Se o título não existe, cria em `titulo`
  - Se o herói não tem o título, associa em `user_heroi_titulo`
- Processa level-up com `processarLevelUp()`
- Atualiza herói com `sql.atualizarHeroi(...)`
- Atualiza guilda com `sql.atualizarGuilda(...)`
- Registra conclusão em `heroi_missao`
- Verifica limite de participantes e fecha missão automaticamente se necessário
- Retorna mensagem de sucesso e dados do herói atualizados
- Frontend invalida query `['heroisMissoes', '1']`
- Mensagem de sucesso aparece e some em 4 segundos

### 5.15 GET /usuario/perfil

- `Perfil.jsx` carrega perfil via `useQuery`
- `GET http://localhost:418/usuario/perfil`

No backend:

- `userRota.js` define rota autenticada
- `useControllers.js` chama `sql.getPerfil(userId)`
- Retorna nome, usuário e email
- `Perfil.jsx` preenche o formulário de edição

### 5.16 PUT /usuario/perfil/atualizar

- `Perfil.jsx` coleta dados de perfil e senhas
- Valida com Zod no cliente
- `PUT http://localhost:418/usuario/perfil/atualizar`

No backend:

- `userRota.js` define rota autenticada
- `useControllers.js` valida com Zod
- Busca hash atual com `sql.getSenha(userId)`
- Compara senha atual com `bcrypt.compare`
- Se nova senha existe, cria `novoHash`
- `sql.editarDados(...)` atualiza dados do usuário
- Retorna mensagem de sucesso
- Frontend invalida query `['perfil']`
- Mensagem anima com Framer Motion

---

## 6. Banco de Dados

**Nome:** heroi
**Engine:** MySQL 8+

### 6.1 Tabela: usuario

Armazena os usuários recrutadores do sistema.

- `id_usuario` INT PK AUTO_INCREMENT
- `nome` VARCHAR
- `nome_usuario` VARCHAR
- `email` VARCHAR UNIQUE
- `senha` VARCHAR

### 6.2 Tabela: heroi

Armazena os heróis criados pelos usuários.

- `id_heroi` INT PK AUTO_INCREMENT
- `fk_usuario` INT FK → usuario
- `fk_guilda` INT FK → guilda
- `nome` VARCHAR
- `classe` VARCHAR
- `imagem` VARCHAR
- `nivel` INT
- `xps` INT
- `ouro` INT
- `status` VARCHAR
- `descricao` VARCHAR
- `ordem` INT

### 6.3 Tabela: guilda

Armazena as guildas criadas pelos usuários.

- `id_guilda` INT PK AUTO_INCREMENT
- `fk_usuario` INT FK → usuario
- `nome` VARCHAR
- `pontos` INT
- `ouro` INT
- `expose` VARCHAR
- `especializacao` VARCHAR
- `descricao` VARCHAR
- `ordem` INT

### 6.4 Tabela: missao

Armazena as missões criadas pelos usuários.

- `id_missao` INT PK AUTO_INCREMENT
- `fk_usuario` INT FK → usuario
- `nome` VARCHAR
- `tipo` VARCHAR
- `origem` VARCHAR
- `local_missao` VARCHAR
- `objetivo` VARCHAR
- `recomendacao` VARCHAR
- `recompensa` VARCHAR
- `expose` VARCHAR
- `titulo` VARCHAR
- `nivel` INT
- `pontos` INT
- `ouro` INT
- `descricao` VARCHAR
- `limite_participantes` INT

### 6.5 Tabela: heroi_missao (junction)

Registra quais heróis completaram quais missões.

- `id_heroi_missao` INT PK AUTO_INCREMENT
- `fk_heroi` INT FK → heroi
- `fk_missao` INT FK → missao
- `expose` VARCHAR
- `completa` BOOLEAN
- `quantidade` INT
- UNIQUE(`fk_heroi`, `fk_missao`)

### 6.6 Tabela: titulo

Armazena os títulos conquistados.

- `id_titulo` INT PK AUTO_INCREMENT
- `titulo` VARCHAR
- `fk_usuario` INT FK → usuario

### 6.7 Tabela: user_heroi_titulo (junction)

Relaciona heróis com seus títulos.

- `fk_heroi` INT FK → heroi
- `fk_titulo` INT FK → titulo

### 6.8 Tabela: user_guilda_titulo (junction)

Relaciona guildas com seus títulos.

- `fk_guilda` INT FK → guilda
- `fk_titulo` INT FK → titulo

---

## 7. Backend

### 7.1 server.js

Arquivo: `back/server.js`

O que faz:

- Importa `express`, `cors` e as rotas
- Configura CORS
- Configura `express.json()`
- Registra rotas de `userRota.js`
- Inicia servidor na porta 418

### 7.2 config/db.js

Arquivo: `back/src/config/db.js`

O que faz:

- Lê variáveis do `.env`
- Cria pool de conexões MySQL
- Exporta o pool com `.promise()` para async/await
- Todas as queries usam esta conexão

### 7.3 zod/useZod.js

Arquivo: `back/src/zod/useZod.js`

O que faz:

Define schemas de validação para cada tipo de dados:

- `validacaoCadastro`
- `validacaoHeroi`
- `validacaoPerfil`
- `validacaoGuilda`
- `validacaoMissao`

### 7.4 middlewares/useMiddlewares.js

Arquivo: `back/src/middlewares/useMiddlewares.js`

O que faz:

Middleware de autenticação JWT:

1. Extrai token do header `Authorization`
2. Se não existe, retorna 403
3. Verifica token com `JWT_SECRET`
4. Se inválido, retorna 401
5. Se válido, salva `req.user = { usuario, id }`
6. Chama `next()`

### 7.5 model/useModel.js

Arquivo: `back/src/model/useModel.js`

O que faz:

Camada de dados com funções SQL para:

- Usuário
- Herói
- Guilda
- Missão
- Títulos
- Junctions
- Dashboard

### 7.6 controllers/useControllers.js

Arquivo: `back/src/controllers/useControllers.js`

O que faz:

Lógica de negócio que valida, processa e responde.

Funções principais:

- `login`
- `cadastro`
- `herois`
- `heroi`
- `novoHeroi`
- `excluirHeroi`
- `mostrarGuidas`
- `guildas`
- `novaGuilda`
- `mostrarPerfil`
- `atualizarPerfil`
- `missoes`
- `novaMissao`
- `fecharMissao`
- `completarMissao`
- `missoesHeroi`

Função `processarLevelUp(heroi)`:
- processa level-ups em loop
- verifica XP vs `pontos_xps`
- sobe nível ou converte XP em ouro
- atualiza `ordem` de rank

### 7.7 routes/userRota.js

Arquivo: `back/src/routes/userRota.js`

Rotas da API:

- `POST /cadastro` — não autenticada
- `POST /login` — não autenticada
- `GET /herois` — autenticada
- `GET /heroi/:id` — autenticada
- `POST /herois/adicionar` — autenticada
- `DELETE /heroi/:id` — autenticada
- `GET /herois/guildas` — autenticada
- `GET /guilda` — autenticada
- `POST /guilda/adicionar` — autenticada
- `GET /usuario/perfil` — autenticada
- `PUT /usuario/perfil/atualizar` — autenticada
- `POST /missao/adicionar` — autenticada
- `GET /missao` — autenticada
- `PUT /missao/fechar/:id` — autenticada
- `POST /heroi/:heroiId/completar-missao/:missaoId` — autenticada
- `GET /heroi/:id/missoes` — autenticada

### 7.8 api/herois.json

Arquivo: `back/src/api/herois.json`

Define 25 ranks para heróis baseados em faixa de nível.

Exemplos:
- `F-` — 1-9 — 100 XP
- `F` — 10-19 — 200 XP
- ...
- `Omega` — 300 — multicolorido

### 7.9 api/guildas.json

Arquivo: `back/src/api/guildas.json`

Define 12 ranks para guildas baseados em pontos de influência.

Exemplos:
- `Pedra` — 0-999
- `Cobre` — 1.000-4.999
- ...
- `Divinium` — 1.000.000+

---

## 8. Frontend

### 8.1 main.jsx

Arquivo: `front/src/main.jsx`

O que faz:

- Importa `BrowserRouter`
- Importa `App.jsx`
- Renderiza `<App />` dentro de `<BrowserRouter>` e `<StrictMode>`
- Monta no `<div id="root">`

### 8.2 App.jsx

Arquivo: `front/src/App.jsx`

O que faz:

- Cria `QueryClient`
- Envolve tudo com `<QueryClientProvider>`
- Define rotas dentro e fora do layout

Rotas com Nav:
- `/teste`
- `/heroi/:id`
- `/heroi/:id/missoes`
- `/heroi/novo`
- `/perfil`
- `/guildas`
- `/guildas/novo`
- `/missoes`
- `/missoes/novo`

Rotas sem Nav:
- `/login`
- `/cadastro`
- `/acesso-negado`

### 8.3 api/validacao.js

Arquivo: `front/src/api/validacao.js`

O que faz:

- Configura instância Axios com `baseURL` de ambiente
- Intercepta requests para adicionar token
- Intercepta responses 403 para limpar token e redirecionar

### 8.4 api/apisRotas.js

Arquivo: `front/src/api/apisRotas.js`

Funções de chamada HTTP:

- `apiLogin` — POST `/login`
- `apiCadastrar` — POST `/cadastro`
- `apiMostrarHerois` — GET `/herois`
- `heroi(id)` — GET `/heroi/:id`
- `apiAdicionarHeroi` — POST `/herois/adicionar`
- `apiExcluirHeroi` — DELETE `/heroi/:id`
- `apiGuildas` — GET `/herois/guildas`
- `apiMostrarGuildas` — GET `/guilda`
- `apiAdicionarGuilda` — POST `/guilda/adicionar`
- `apiBuscarPerfil` — GET `/usuario/perfil`
- `apiAtualizarPerfil` — PUT `/usuario/perfil/atualizar`
- `apiMissoes` — GET `/missao`
- `apiCriarMissao` — POST `/missao/adicionar`
- `apiFecharMissao` — PUT `/missao/fechar/:id`
- `apiMissoesHeroi` — GET `/heroi/:id/missoes`
- `apiCompletarMissao` — POST `/heroi/:id/completar-missao/:id`

### 8.5 Páginas

- `Login.jsx`: login, validação Zod, `useMutation`, salva token, navega para `/teste`
- `Cadastro.jsx`: cadastro, validação Zod, `useMutation`, mensagens com Framer Motion
- `Perfil.jsx`: carrega perfil, edita dados, valida com Zod, logout e mensagens animadas
- `Layout.jsx`: renderiza `Nav.jsx` + `<Outlet />`
- `AcessoNegado.jsx`: página 403 com animação e link para login

### 8.6 Componentes

- `Nav.jsx`: navegação, links, usuário logado
- `Home.jsx`: lista de heróis, estatísticas, filtro por classe
- `Cards.jsx`: card de herói com animações e link para detalhes
- `Heroi.jsx`: detalhes do herói, botões e exclusão
- `CriarHeroi.jsx`: formulário de criação de herói, validação Zod
- `Guildas.jsx`: lista de guildas com rank
- `CardGuilda.jsx`: card de guilda com stats e animações
- `CriarGuildas.jsx`: formulário de criação de guilda
- `Missoes.jsx`: lista de missões, menu de ações, fechar missão
- `CriarMissoes.jsx`: formulário completo de criação de missão
- `HeroiMissoes.jsx`: listas de missões disponíveis e concluídas, completar missão

---

## 9. Regras de Negócio

### 9.1 Evolução de Nível do Herói

- Baseado em `herois.json`
- Cada rank define `nivel_min`, `nivel_max`, `pontos_xps` e `ouro_necessario`

Regras:

1. Se `nivel < nivel_max` e `xps >= pontos_xps`, sobe de nível e o excesso de XP vai para o próximo nível.
2. Se `nivel == nivel_max`:
   - se `ouro >= ouro_necessario`, sobe de nível, gasta ouro e usa o excesso de XP
   - se não, não sobe, zera o XP e converte 5% do excesso em ouro
3. O sistema processa múltiplos level-ups em loop.
4. Ao mudar de nível, atualiza a `ordem` com base no novo rank.

### 9.2 Evolução de Rank da Guilda

- Baseada em pontos, não XP.
- Ranks estão em `guildas.json`.
- Ao receber pontos de missão, a guilda recalcula rank.

### 9.3 Conclusão de Missão

- Um herói completa uma missão específica
- O herói recebe ouro, XP e título (se existir)
- A guilda recebe ouro e pontos
- Se o limite de participantes for atingido, `expose` vira `false`
- O herói não pode completar a mesma missão duas vezes

### 9.4 Fechamento de Missão (2 formas)

1. Manual: criador clica "Fechar Missão" → `expose = 'false'`
2. Automática: quando `limite_participantes` é atingido → `expose = 'false'`

### 9.5 Títulos

- Cada missão pode ter um campo `titulo`
- Ao completar, o sistema verifica se o título já existe
- Se não existir, cria em `titulo`
- Se o herói não tiver, associa em `user_heroi_titulo`
- Um herói não pode receber o mesmo título duas vezes

### 9.6 Autenticação

- Todas as rotas, exceto `/login` e `/cadastro`, exigem JWT
- Token expira em 5 horas
- Frontend armazena no `localStorage`
- Se receber 403, frontend remove token e redireciona para `/acesso-negado`

---

## Fim da Documentação
