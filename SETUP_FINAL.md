# 🎉 Sistema Configurado com Sucesso!

## ✅ O que está funcionando

Todos os containers Docker estão rodando:

- **PostgreSQL**: `localhost:5434`
- **Backend API**: `http://localhost:3001`
- **Frontend**: `http://localhost:5174`
- **Swagger API Docs**: `http://localhost:3001/api`

## 🚀 Como Acessar

### Frontend (Landing Page)
```
http://localhost:5174
```

A landing page está funcional com:
- Hero section e informações do curso
- Botão "Tenho Interesse" (abre modal com formulário)
- Formulário de dúvidas no rodapé

### Área Administrativa
```
http://localhost:5174/sistema/login
```

**Nota:** O banco está vazio no momento. Para popular com dados de teste, você tem duas opções:

## 📊 Populando o Banco de Dados

### Opção 1: Via API (Recomendado para Docker)

Crie manualmente o primeiro usuário ADMIN via API:

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Administrador",
    "email": "admin@capturaleads.com",
    "password": "admin123",
    "perfil": "ADMIN"
  }'
```

Depois faça login e crie os outros dados pela interface administrativa.

### Opção 2: Executar Seeds Localmente

Se você tiver o Node.js instalado localmente:

```bash
# 1. Instalar dependências do backend
cd backend
npm install

# 2. Configurar .env para apontar para o banco Docker
cat > .env << 'ENVEOF'
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=captura_leads
ENVEOF

# 3. Rodar seeds
npm run seed
```

## 🔑 Credenciais Padrão (Após Seeds)

**ADMIN:**
- Email: `admin@capturaleads.com`
- Senha: `admin123`

**OPERATOR:**
- Email: `joao@capturaleads.com`  
- Senha: `operador123`

## 📱 Testando a Aplicação

1. **Teste a Landing Page:**
   - Acesse http://localhost:5174
   - Clique em "Tenho Interesse"
   - Preencha o formulário
   - Envie uma dúvida no final da página

2. **Teste o Sistema Administrativo:**
   - Faça login em http://localhost:5174/sistema/login
   - Explore os dashboards (após popular o banco)

## 🛠️ Comandos Úteis

```bash
# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Parar containers
docker-compose down

# Reiniciar containers
docker-compose restart

# Rebuild containers
docker-compose up -d --build

# Acessar shell do container
docker exec -it captura_leads_backend sh

# Ver status
docker-compose ps
```

## 🗂️ Estrutura do Projeto

```
captura_leads/
├── backend/           # API NestJS (porta 3001)
├── frontend/          # React App (porta 5174)
├── docker-compose.yml # Configuração Docker
├── SETUP.md           # Guia de setup detalhado
└── DOCKER_SETUP.md    # Guia específico do Docker
```

## ⚠️ Notas Importantes

1. **Portas Alternativas**: O projeto usa portas 3001 e 5174 porque você tem outro projeto (solar) usando as portas padrão 3000 e 5173.

2. **Hot Reload**: O código no backend e frontend é montado como volume, então qualquer alteração será refletida automaticamente.

3. **PostgreSQL**: Está rodando em um container Docker na porta 5434 (mapeada de 5432 interna).

4. **Synchronize**: O TypeORM está configurado com `synchronize: true` em desenvolvimento, então as tabelas são criadas automaticamente quando o backend inicia.

## 🔄 Próximos Passos

1. Popule o banco com dados de teste (veja Opção 1 ou 2 acima)
2. Acesse http://localhost:5174 e teste a landing page
3. Faça login em http://localhost:5174/sistema/login
4. Explore a documentação da API em http://localhost:3001/api

## 🐛 Problemas Comuns

**Backend não conecta no banco:**
- Aguarde ~10 segundos após `docker-compose up`
- Verifique os logs: `docker logs captura_leads_backend`

**Frontend não carrega:**
- Verifique se está acessando porta 5174 (não 5173)
- Limpe o cache do navegador

**Porta em uso:**
- Pare os containers do projeto "solar" ou ajuste as portas

## 📚 Documentação

- [README.md](./README.md) - Visão geral do projeto
- [CLAUDE.md](./CLAUDE.md) - Documentação técnica completa
- [SETUP.md](./SETUP.md) - Guia de instalação detalhado
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Configuração Docker

---

**Sistema desenvolvido com NestJS + React + PostgreSQL + Docker**
