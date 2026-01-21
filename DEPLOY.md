# Deploy no Heroku - Captura de Leads

Este guia descreve como fazer o deploy da aplicação no Heroku com ambientes separados para frontend, backend e banco de dados PostgreSQL.

## Pré-requisitos

1. Conta no Heroku (https://heroku.com)
2. Heroku CLI instalado
3. Git instalado
4. Cartão de crédito cadastrado no Heroku (necessário para add-ons)

### Instalar Heroku CLI

```bash
# Ubuntu/Debian
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh

# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Baixe o instalador em: https://devcenter.heroku.com/articles/heroku-cli
```

## Estrutura de Deploy

- **captura-leads-api**: Backend NestJS + PostgreSQL (add-on)
- **captura-leads-web**: Frontend React (arquivos estáticos)

---

## Passo 1: Login no Heroku

```bash
heroku login
```

---

## Passo 2: Criar App do Backend

```bash
# Navegue até a pasta do backend
cd backend

# Crie o app no Heroku
heroku create captura-leads-api

# Adicione o PostgreSQL
heroku addons:create heroku-postgresql:essential-0 -a captura-leads-api

# Configure as variáveis de ambiente
heroku config:set NODE_ENV=production -a captura-leads-api
heroku config:set JWT_SECRET=sua_chave_jwt_super_secreta_aqui -a captura-leads-api
heroku config:set JWT_EXPIRATION=1d -a captura-leads-api
heroku config:set JWT_REFRESH_EXPIRATION=7d -a captura-leads-api
heroku config:set CORS_ORIGIN=https://captura-leads-web-XXXXX.herokuapp.com -a captura-leads-api

# A DATABASE_URL é configurada automaticamente pelo add-on PostgreSQL
```

### Configurar Git Remote para o Backend

```bash
# Adicione o remote do Heroku
heroku git:remote -a captura-leads-api

# Renomeie para identificar melhor
git remote rename heroku heroku-api
```

---

## Passo 3: Criar App do Frontend

```bash
# Navegue até a pasta do frontend
cd ../frontend

# Crie o app no Heroku
heroku create captura-leads-web

# Configure a URL da API
heroku config:set VITE_API_URL=https://captura-leads-api-XXXXX.herokuapp.com -a captura-leads-web

# Adicione o remote do Heroku
heroku git:remote -a captura-leads-web

# Renomeie para identificar melhor
git remote rename heroku heroku-web
```

---

## Passo 4: Deploy Sob Demanda

### Deploy do Backend

```bash
# Da raiz do projeto
cd backend

# Push apenas da pasta backend para o Heroku
git subtree push --prefix backend heroku-api main

# OU se estiver usando branches separadas:
git push heroku-api main
```

### Deploy do Frontend

```bash
# Da raiz do projeto
cd frontend

# Push apenas da pasta frontend para o Heroku
git subtree push --prefix frontend heroku-web main

# OU se estiver usando branches separadas:
git push heroku-web main
```

---

## Passo 5: Executar Migrations e Seed (Backend)

```bash
# Executar migrations (já configurado no Procfile release)
# As migrations rodam automaticamente no deploy

# Para executar seed manualmente
heroku run npm run seed -a captura-leads-api
```

---

## Comandos Úteis

### Ver logs
```bash
# Backend
heroku logs --tail -a captura-leads-api

# Frontend
heroku logs --tail -a captura-leads-web
```

### Verificar status
```bash
heroku ps -a captura-leads-api
heroku ps -a captura-leads-web
```

### Abrir aplicação
```bash
heroku open -a captura-leads-web
```

### Reiniciar dynos
```bash
heroku restart -a captura-leads-api
heroku restart -a captura-leads-web
```

### Acessar console do banco
```bash
heroku pg:psql -a captura-leads-api
```

### Ver variáveis de ambiente
```bash
heroku config -a captura-leads-api
heroku config -a captura-leads-web
```

---

## Atualizar CORS após criar os apps

Após criar os dois apps, você terá as URLs reais. Atualize o CORS no backend:

```bash
# Substitua XXXXX pelo identificador real do seu app
heroku config:set CORS_ORIGIN=https://captura-leads-web.herokuapp.com -a captura-leads-api
```

E atualize a URL da API no frontend:

```bash
heroku config:set VITE_API_URL=https://captura-leads-api.herokuapp.com -a captura-leads-web
```

---

## Estrutura de Custos (Heroku 2024)

| Recurso | Plano | Custo Estimado |
|---------|-------|----------------|
| Backend Dyno | Eco ($5/mês) ou Basic ($7/mês) | $5-7/mês |
| Frontend Dyno | Eco ($5/mês) ou Basic ($7/mês) | $5-7/mês |
| PostgreSQL | Essential-0 | $5/mês |
| **Total** | | **~$15-19/mês** |

> **Nota**: O plano Eco tem "sleep" após 30min de inatividade. O Basic fica sempre ativo.

---

## Deploy via GitHub Integration (Recomendado)

Esta é a forma mais simples e visual de fazer deploy sob demanda, sem precisar usar a linha de comando.

### Passo 1: Criar os Apps no Heroku Dashboard

1. Acesse https://dashboard.heroku.com
2. Clique em **"New"** > **"Create new app"**
3. Crie o app do backend:
   - App name: `captura-leads-api` (ou outro nome disponível)
   - Region: United States (ou Europe)
   - Clique em **"Create app"**
4. Repita para criar o app do frontend:
   - App name: `captura-leads-web`

### Passo 2: Adicionar PostgreSQL ao Backend

1. No dashboard, acesse o app `captura-leads-api`
2. Vá na aba **"Resources"**
3. Em "Add-ons", pesquise por **"Heroku Postgres"**
4. Selecione o plano **"Essential-0"** ($5/mês)
5. Clique em **"Submit Order Form"**

> A variável `DATABASE_URL` será configurada automaticamente.

### Passo 3: Configurar Variáveis de Ambiente

#### Backend (`captura-leads-api`):

1. No dashboard do app, vá em **"Settings"**
2. Clique em **"Reveal Config Vars"**
3. Adicione as seguintes variáveis:

| KEY | VALUE |
|-----|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `sua_chave_jwt_super_secreta_aqui` |
| `JWT_EXPIRATION` | `1d` |
| `JWT_REFRESH_EXPIRATION` | `7d` |
| `CORS_ORIGIN` | `https://captura-leads-web.herokuapp.com` |

#### Frontend (`captura-leads-web`):

1. No dashboard do app, vá em **"Settings"**
2. Clique em **"Reveal Config Vars"**
3. Adicione:

| KEY | VALUE |
|-----|-------|
| `VITE_API_URL` | `https://captura-leads-api.herokuapp.com` |

### Passo 4: Conectar ao GitHub

#### Para o Backend:

1. No dashboard do app `captura-leads-api`, vá em **"Deploy"**
2. Em "Deployment method", clique em **"GitHub"**
3. Clique em **"Connect to GitHub"** (autorize se necessário)
4. Pesquise pelo repositório `captura_leads` e clique em **"Connect"**
5. **IMPORTANTE**: Em "App connected to GitHub", configure:
   - Clique em **"Enable Automatic Deploys"** se quiser deploy automático (opcional)
   - Ou deixe apenas o deploy manual

#### Para o Frontend:

Repita o mesmo processo para o app `captura-leads-web`.

### Passo 5: Configurar o Diretório de Build (Monorepo)

Como o projeto tem frontend e backend no mesmo repositório, você precisa informar ao Heroku qual pasta usar.

#### Para o Backend:

1. No dashboard do app `captura-leads-api`, vá em **"Settings"**
2. Em "Buildpacks", clique em **"Add buildpack"**
3. Primeiro, adicione: `https://github.com/timanovsky/subdir-heroku-buildpack`
4. Depois, adicione: `heroku/nodejs`
5. **Importante**: O buildpack `subdir-heroku-buildpack` deve ficar PRIMEIRO na lista
6. Em "Config Vars", adicione:

| KEY | VALUE |
|-----|-------|
| `PROJECT_PATH` | `backend` |

#### Para o Frontend:

1. No dashboard do app `captura-leads-web`, vá em **"Settings"**
2. Em "Buildpacks", adicione na ordem:
   - `https://github.com/timanovsky/subdir-heroku-buildpack`
   - `heroku/nodejs`
3. Em "Config Vars", adicione:

| KEY | VALUE |
|-----|-------|
| `PROJECT_PATH` | `frontend` |

### Passo 6: Fazer Deploy Manual

1. No dashboard de cada app, vá em **"Deploy"**
2. Role até a seção **"Manual deploy"**
3. Selecione a branch `main`
4. Clique em **"Deploy Branch"**
5. Aguarde o build completar (você pode ver os logs em tempo real)

### Passo 7: Executar Seed Inicial (Primeira vez)

Após o primeiro deploy do backend:

1. No dashboard do app `captura-leads-api`
2. Clique em **"More"** (canto superior direito) > **"Run console"**
3. Digite: `npm run seed`
4. Clique em **"Run"**

### Fluxo de Deploy Sob Demanda

Sempre que quiser fazer um novo deploy:

1. Faça commit e push das alterações para o GitHub:
   ```bash
   git add .
   git commit -m "Sua mensagem"
   git push origin main
   ```

2. Acesse o dashboard do Heroku
3. Vá no app que deseja atualizar (backend ou frontend)
4. Clique em **"Deploy"** > **"Deploy Branch"**

### Verificar se o Deploy Funcionou

1. **Backend**: Acesse `https://captura-leads-api.herokuapp.com/api`
   - Deve mostrar a documentação Swagger

2. **Frontend**: Acesse `https://captura-leads-web.herokuapp.com`
   - Deve mostrar a landing page

### Diagrama do Fluxo

```
┌─────────────┐     push      ┌─────────────┐
│   Seu PC    │ ───────────▶  │   GitHub    │
│  (código)   │               │ (repositório)│
└─────────────┘               └──────┬──────┘
                                     │
                        ┌────────────┴────────────┐
                        │                         │
                        ▼                         ▼
               ┌────────────────┐       ┌────────────────┐
               │ captura-leads  │       │ captura-leads  │
               │     -api       │       │     -web       │
               │   (Heroku)     │       │   (Heroku)     │
               └───────┬────────┘       └────────────────┘
                       │
                       ▼
               ┌────────────────┐
               │   PostgreSQL   │
               │   (Add-on)     │
               └────────────────┘
```

---

## Troubleshooting

### Erro de build no backend
```bash
heroku logs --tail -a captura-leads-api
```

### Erro de conexão com banco
Verifique se a DATABASE_URL está configurada:
```bash
heroku config:get DATABASE_URL -a captura-leads-api
```

### Frontend não carrega API
Verifique se VITE_API_URL está correta e se o CORS está configurado no backend.

### Migrations não rodam
Execute manualmente:
```bash
heroku run npm run migration:run -a captura-leads-api
```
