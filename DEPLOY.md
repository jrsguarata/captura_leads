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

## Alternativa: Deploy via GitHub Integration

1. Acesse o dashboard do Heroku
2. Vá em cada app > Deploy > Deployment method
3. Selecione "GitHub"
4. Conecte seu repositório
5. Configure "Manual Deploy" para deploy sob demanda
6. Clique em "Deploy Branch" quando quiser fazer deploy

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
