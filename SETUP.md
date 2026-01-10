# Guia Rápido de Setup

## Opção 1: Docker (Mais Rápido)

```bash
# 1. Copiar .env
cp .env.example .env

# 2. Subir containers
docker-compose up -d

# 3. Aguardar ~30 segundos para os containers iniciarem

# 4. Acessar aplicações
# - Frontend: http://localhost:5173
# - Backend: http://localhost:3000
# - Swagger: http://localhost:3000/api
```

## Opção 2: Local

```bash
# 1. Instalar dependências
cd backend && npm install
cd ../frontend && npm install

# 2. Configurar .env
cp .env.example .env
# Editar .env com suas configurações do PostgreSQL

# 3. Criar banco de dados
createdb captura_leads

# 4. Rodar migrations
cd backend
npm run migration:run

# 5. Popular banco com seeds
npm run seed

# 6. Iniciar backend (terminal 1)
npm run start:dev

# 7. Iniciar frontend (terminal 2)
cd ../frontend
npm run dev
```

## Credenciais de Teste

### Administrador
- **Email:** admin@capturaleads.com
- **Senha:** admin123
- **Acesso:** Dashboard completo, gerencia usuários, perguntas de qualificação, etc.

### Operador
- **Email:** joao@capturaleads.com
- **Senha:** operador123
- **Acesso:** Dashboard operacional, gerencia leads e dúvidas

### Operador 2
- **Email:** maria@capturaleads.com
- **Senha:** operador123
- **Acesso:** Dashboard operacional, gerencia leads e dúvidas

## Acessos

### Landing Page (Pública)
**URL:** http://localhost:5173/

Funcionalidades:
- Visualizar informações do curso
- Botão "Tenho Interesse" - Abre modal com:
  - Formulário de dados pessoais (nome, email, celular)
  - Perguntas de qualificação dinâmicas
  - Confirmação de envio
- Formulário de dúvidas na parte inferior

### Área Administrativa
**URL:** http://localhost:5173/sistema/login

#### Dashboard ADMIN (admin@capturaleads.com)
- **URL:** http://localhost:5173/sistema/admin
- Visão geral com estatísticas
- Gerenciar Interessados (visualizar todos)
- Gerenciar Perguntas de Qualificação (CRUD)
- Gerenciar Dúvidas (visualizar e marcar como respondida)
- Gerenciar Usuários (criar, ativar/desativar)

#### Dashboard OPERATOR (joao@capturaleads.com)
- **URL:** http://localhost:5173/sistema/operator
- Visão geral pessoal
- Ver seus Interessados
- Gerenciar Dúvidas (visualizar e marcar como respondida)
- Registrar Follow-ups (apenas pode editar os próprios)

## Testando a Aplicação

### 1. Testar Landing Page
1. Acesse http://localhost:5173/
2. Clique em "Tenho Interesse"
3. Preencha o formulário com seus dados
4. Responda as perguntas de qualificação
5. Confirme o envio
6. Role até o final e envie uma dúvida

### 2. Testar Área Administrativa
1. Acesse http://localhost:5173/sistema/login
2. Faça login com admin@capturaleads.com / admin123
3. Veja o dashboard com estatísticas
4. Navegue pelas páginas de gerenciamento
5. Veja os dados de teste já populados (5 interessados, 5 dúvidas)

### 3. Testar Dashboard Operador
1. Faça logout (botão vermelho no canto superior direito)
2. Faça login com joao@capturaleads.com / operador123
3. Veja o dashboard do operador (com menos opções)
4. Navegue pelos interessados e dúvidas

## Estrutura de Dados

O banco vem populado com:
- **3 Usuários:** 1 Admin + 2 Operadores
- **6 Perguntas de Qualificação:** Ativas e prontas para uso
- **5 Interessados de Exemplo:** Com status variados (Lead, Prospect, Negotiation, Win, Lost)
- **5 Dúvidas de Exemplo:** Com status variados (Pending, Answered)
- **Follow-ups de Exemplo:** Associados aos interessados

## API Documentation

Após iniciar o backend, acesse:
**http://localhost:3000/api**

Documentação completa com Swagger UI, incluindo:
- Todos os endpoints disponíveis
- Schemas de dados
- Possibilidade de testar endpoints diretamente

## Troubleshooting

### Erro ao conectar no banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Tente: `createdb captura_leads`

### Porta já em uso
- Backend (3000): Mude `PORT` no `.env`
- Frontend (5173): Mude `server.port` no `frontend/vite.config.ts`
- PostgreSQL (5432): Mude `DB_PORT` no `.env`

### Docker não inicia
- Certifique-se que o Docker está rodando
- Tente: `docker-compose down && docker-compose up -d`
- Veja logs: `docker-compose logs -f`

### Frontend não conecta no backend
- Verifique se o backend está rodando em http://localhost:3000
- Confirme a variável `VITE_API_URL` no `frontend/.env`
- Limpe o cache do navegador

## Próximos Passos

1. Explore a landing page e teste o formulário de interesse
2. Faça login no sistema administrativo
3. Navegue pelas diferentes páginas do dashboard
4. Teste as funcionalidades de CRUD
5. Veja as diferentes permissões entre ADMIN e OPERATOR
6. Consulte a documentação da API no Swagger

## Suporte

Para mais informações, consulte:
- [README.md](./README.md) - Documentação geral
- [CLAUDE.md](./CLAUDE.md) - Documentação técnica completa
- [Swagger UI](http://localhost:3000/api) - Documentação da API
