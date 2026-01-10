# 📊 Sistema de Gestão de Captura de Leads

Plataforma completa para captura e gestão de leads interessados em cursos presenciais.

## 🎯 Funcionalidades

### Landing Page Pública (`/`)
- Informações sobre o curso
- Formulário de interesse com perguntas de qualificação
- Área para envio de dúvidas

### Área Administrativa (`/sistema`)
- **Dashboard ADMIN**: Gerenciamento completo do sistema
- **Dashboard OPERATOR**: Gerenciamento de leads e follow-ups
- Sistema de autenticação JWT
- CRUD completo de todas as entidades
- Sistema de auditoria completo

## 🛠️ Stack Tecnológica

**Backend:**
- NestJS 10.3+
- TypeScript 5.3+
- PostgreSQL 16+
- TypeORM
- JWT Authentication
- Swagger/OpenAPI

**Frontend:**
- React 18.3+
- TypeScript 5.3+
- Vite 5.0+
- Tailwind CSS
- React Router
- Axios

## 🚀 Quick Start

### Pré-requisitos
- Node.js 20 LTS
- PostgreSQL 16+ (ou Docker)
- npm ou pnpm

### Opção 1: Com Docker (Recomendado)

```bash
# Clonar repositório
git clone <url-do-repo>
cd captura_leads

# Copiar .env
cp .env.example .env

# Subir toda a stack
docker-compose up -d

# Aguardar containers iniciarem e acessar
# Backend: http://localhost:3000
# Frontend: http://localhost:5173
# Swagger: http://localhost:3000/api
```

### Opção 2: Setup Local

```bash
# 1. Instalar dependências
npm run install:all

# 2. Configurar .env
cp .env.example .env
# Editar .env com suas configurações

# 3. Criar banco de dados PostgreSQL
createdb captura_leads

# 4. Rodar migrations
cd backend
npm run migration:run

# 5. Popular banco com seeds
npm run seed

# 6. Iniciar backend (terminal 1)
cd backend
npm run start:dev

# 7. Iniciar frontend (terminal 2)
cd frontend
npm run dev
```

## 📡 API Endpoints

### Autenticação
- `POST /auth/login` - Login
- `POST /auth/refresh` - Renovar token

### Usuários
- `GET /users` - Listar usuários
- `POST /users` - Criar usuário (ADMIN)
- `PATCH /users/:id` - Atualizar usuário
- `PATCH /users/:id/activate` - Ativar (ADMIN)
- `PATCH /users/:id/deactivate` - Desativar (ADMIN)

### Interessados
- `POST /interessados` - Criar (público)
- `GET /interessados` - Listar
- `GET /interessados/:id` - Buscar por ID
- `PATCH /interessados/:id` - Atualizar
- `GET /interessados/status/:status` - Buscar por status

### Qualificação
- `GET /qualificacao/active` - Listar perguntas ativas (público)
- `POST /qualificacao` - Criar pergunta (ADMIN)
- `PATCH /qualificacao/:id` - Atualizar pergunta (ADMIN)

### Respostas
- `POST /respostas` - Criar resposta (público)
- `POST /respostas/batch` - Criar múltiplas respostas (público)
- `GET /respostas/interessado/:id` - Buscar respostas do interessado

### Dúvidas
- `POST /duvidas` - Criar dúvida (público)
- `GET /duvidas` - Listar dúvidas
- `PATCH /duvidas/:id` - Atualizar dúvida

### Follow-up
- `POST /followup` - Criar follow-up
- `GET /followup` - Listar follow-ups
- `GET /followup/interessado/:id` - Follow-ups do interessado
- `PATCH /followup/:id` - Atualizar follow-up

**Documentação completa:** http://localhost:3000/api

## 👥 Usuários Padrão (Seeds)

Após rodar os seeds, você terá os seguintes usuários:

**ADMIN:**
- Email: `admin@capturaleads.com`
- Senha: `admin123`

**OPERATORS:**
- Email: `joao@capturaleads.com`
- Senha: `operador123`

- Email: `maria@capturaleads.com`
- Senha: `operador123`

## 🗂️ Estrutura do Projeto

```
captura_leads/
├── backend/          # API NestJS
│   ├── src/
│   │   ├── modules/  # Módulos da aplicação
│   │   ├── common/   # Guards, decorators, enums
│   │   └── database/ # Migrations e seeds
│   └── ...
├── frontend/         # App React
│   ├── src/
│   │   ├── pages/    # Páginas
│   │   ├── components/ # Componentes
│   │   └── services/ # API calls
│   └── ...
└── docker-compose.yml
```

## 📝 Scripts Disponíveis

### Raiz
```bash
npm run install:all     # Instalar todas as dependências
npm run docker:up       # Subir Docker
npm run docker:down     # Parar Docker
npm run docker:logs     # Ver logs
```

### Backend
```bash
npm run start:dev       # Dev mode
npm run build           # Build
npm run migration:run   # Rodar migrations
npm run seed            # Popular banco
npm run lint            # ESLint
npm run test            # Testes
```

### Frontend
```bash
npm run dev             # Dev mode
npm run build           # Build
npm run preview         # Preview build
npm run lint            # ESLint
npm run test            # Testes
```

## 🔒 Segurança

- ✅ Autenticação JWT com refresh token
- ✅ Passwords com bcrypt (10 rounds)
- ✅ Autorização por perfil (ADMIN/OPERATOR)
- ✅ Validação de dados com class-validator
- ✅ Soft delete em todas as entidades
- ✅ Sistema de auditoria completo
- ✅ CORS configurado
- ✅ Rate limiting (produção)

## 📚 Documentação

- [CLAUDE.md](./CLAUDE.md) - Documentação técnica completa
- [Swagger UI](http://localhost:3000/api) - Documentação da API

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.