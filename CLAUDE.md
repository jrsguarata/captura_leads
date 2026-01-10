# CLAUDE.md - Sistema de Gestão de Captura de Leads

## 🎯 Descrição do Projeto
Plataforma para a captura de interessados em contratar cursos presenciais. Irá gerenciar desde a captura de leads, o follow-up realizado pelos vendedores até a formalização dos contratos

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3+
- **Language**: TypeScript 5.3+
- **Build Tool**: Vite 5.0+
- **Styling**: Tailwind CSS 3.4+
- **State Management**: Zustand 4.5+ ou React Context
- **Routing**: React Router 6.20+
- **HTTP Client**: Axios 1.6+ com interceptors
- **Form Handling**: React Hook Form 7.49+
- **Validation**: Zod 3.22+
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Icons**: Lucide React
- **Data Fetching**: TanStack Query 5.0+ (React Query)
- **Protocol**: MCP

### Backend
- **Framework**: NestJS 10.3+
- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5.3+
- **ORM**: TypeORM 0.3.19+
- **Database**: PostgreSQL 16+
- **Authentication**: JWT com Passport.js
- **Validation**: class-validator + class-transformer
- **API Docs**: Swagger/OpenAPI (@nestjs/swagger)
- **Logging**: Winston ou built-in Logger
- **Config**: @nestjs/config com dotenv

### Database
- **SGBD**: PostgreSQL 16+
- **Migrations**: TypeORM migrations
- **Seeding**: Custom seed scripts em TypeScript

### DevOps & Tools
- **Container**: Docker + Docker Compose
- **Package Manager**: npm 10+ ou pnpm 8+
- **Linting**: ESLint 8.56+
- **Formatting**: Prettier 3.2+
- **Git Hooks**: Husky + lint-staged
- **Testing Frontend**: Vitest + React Testing Library
- **Testing Backend**: Jest + Supertest

---

## 📊 Entidades do Sistema

### 1. Interessados
Pessoas que manifestaram interesse em se inscrever no curso.

**Campos:**
- `nome`: Nome completo - string - obrigatório
- `email`: Email para contato - string - obrigatório - validar padrão de email
- `celular`: Celular para contato - string (10 ou 11 dígitos) - obrigatório - máscara: (nn) nnnnn-nnnn ou (nn) nnnn-nnnn
- `status`: Status das negociações - enum - obrigatório
  - `lead` - Manifestou interesse
  - `prospect` - Operador entrou em contato e confirmou o interesse
  - `negotiation` - Está em fase de negociação de valores ou outras questões
  - `win` - Foi assinado o contrato
  - `lost` - Cliente desistiu
  - `interrupted` - Empresa interrompeu os contatos
- Campos de auditoria (padrão)

### 2. Qualificação
Perguntas que devem ser feitas aos interessados quando manifestarem interesse.

**Campos:**
- `questao`: Questão a ser feita - string - obrigatório
- `obrigatoriedade`: Indica se a resposta é obrigatória - boolean - obrigatório
- `opcoes`: Opções de resposta - string - opcional
  - Opções separadas por ponto e vírgula (;)
  - Se preenchido, apresentar como lista de opções ao interessado
  - Se vazio, campo livre de texto
- Campos de auditoria (padrão)

### 3. Respostas
Respostas dadas pelos interessados às perguntas de qualificação.

**Campos:**
- `interessado_id`: UUID do interessado - obrigatório - FK para interessados
- `pergunta`: Texto literal da pergunta feita - string - obrigatório
  - Armazenar texto literal (não ID) pois perguntas podem mudar ao longo do tempo
- `resposta`: Resposta dada pelo interessado - string - obrigatório
  - Armazenar texto literal da resposta
- Campos de auditoria (padrão)

### 4. Dúvidas
Dúvidas apresentadas por visitantes na landing page principal.

**Campos:**
- `nome`: Nome completo - string - obrigatório
- `email`: Email para contato - string - obrigatório - validar padrão de email
- `celular`: Celular para contato - string (10 ou 11 dígitos) - obrigatório - máscara: (nn) nnnnn-nnnn ou (nn) nnnn-nnnn
- `duvida`: Texto da dúvida - string - obrigatório
- `resposta`: Texto da resposta enviada - string - opcional
- `status`: Status da resposta - enum - obrigatório
  - `feita` - Dúvida enviada pela landing page
  - `respondida` - Pergunta foi respondida
  - `prospect` - Operador entrou em contato e confirmou interesse
  - `negotiation` - Em fase de negociação
  - `win` - Assinado o contrato
  - `lost` - Cliente desistiu
  - `interrupted` - Empresa interrompeu os contatos
- Campos de auditoria (padrão)

### 5. Follow-up
Registros dos follow-ups feitos com os interessados.

**Campos:**
- `interessado_id`: UUID do interessado - obrigatório - FK para interessados
- `texto`: Registro do follow-up - text - obrigatório
- `canal`: Canal utilizado para o follow-up - enum - obrigatório
  - `email` - Contato feito/recebido por email
  - `whatsapp` - Contato feito/recebido por WhatsApp
  - `voz` - Contato feito por ligação celular
  - `outro` - Outro canal foi utilizado
- Campos de auditoria (padrão)

### Campos de Auditoria (Padrão para todas as tabelas)

Todas as tabelas devem ter os seguintes campos de auditoria:

```typescript
@ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
@JoinColumn({ name: 'criado_por' })
criadoPorUser?: Promise<any>;

@RelationId((entity: BaseEntity) => entity.criadoPorUser)
criadoPor?: string;  // UUID do usuário que criou

@CreateDateColumn({ name: 'criado_em' })
criadoEm: Date;  // Data de criação

@ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
@JoinColumn({ name: 'alterado_por' })
alteradoPorUser?: Promise<any>;

@RelationId((entity: BaseEntity) => entity.alteradoPorUser)
alteradoPor?: string;  // UUID do usuário que alterou

@UpdateDateColumn({ name: 'alterado_em' })
alteradoEm: Date;  // Data de alteração

@ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
@JoinColumn({ name: 'desativado_por' })
desativadoPorUser?: Promise<any>;

@RelationId((entity: BaseEntity) => entity.desativadoPorUser)
desativadoPor?: string;  // UUID do usuário que desativou

@DeleteDateColumn({ name: 'desativado_em' })
desativadoEm?: Date;  // Data da desativação (soft delete)
```

**Observações importantes:**
- Usar **soft delete** em todas as tabelas (campo `desativado_em`)
- Todos os campos de auditoria têm **Foreign Keys** para `users.id` com `onDelete: 'SET NULL'`
- Nomes de campos em português seguindo o padrão snake_case no banco

---

## 🔄 Fluxo do Sistema

### 1. Endereço Raiz: `/` (Landing Page Pública)

**Objetivo**: Capturar leads e dúvidas de visitantes interessados no curso.

#### Componentes da Landing Page:

**A. Informações sobre o Curso**
- Apresentação completa do curso ofertado
- Usar dados mockados por enquanto (serão dinamizados futuramente)
- Design atrativo e responsivo

**B. Card "Tenho Interesse" (Destacado)**
- Card visualmente destacado na página
- Ao clicar, abre **modal** com formulário de captura
- **Campos do Modal**:
  - Nome completo (obrigatório)
  - Email (obrigatório, validar padrão)
  - Celular (obrigatório, máscara (nn) nnnnn-nnnn ou (nn) nnnn-nnnn)
  - Perguntas de qualificação (carregadas dinamicamente da tabela `qualificacao`)
    - Se pergunta tem `opcoes`, apresentar como lista/select
    - Se pergunta não tem `opcoes`, apresentar como campo de texto
    - Respeitar campo `obrigatoriedade` de cada pergunta
- **Ação ao confirmar**:
  - Criar registro na tabela `interessados` com `status: 'lead'`
  - Criar registros na tabela `respostas` para cada pergunta respondida
  - Fechar modal e exibir mensagem de sucesso

**C. Área de Dúvidas**
- Formulário simples com campos:
  - Nome completo (obrigatório)
  - Email (obrigatório, validar padrão)
  - Celular (obrigatório, máscara (nn) nnnnn-nnnn ou (nn) nnnn-nnnn)
  - Dúvida (textarea, obrigatório)
  - Botão "Enviar Dúvida"
- **Ação ao enviar**:
  - Criar registro na tabela `duvidas` com:
    - Dados do formulário
    - `status: 'feita'`
    - `resposta: null` (será preenchida posteriormente pelo operador)
  - Exibir mensagem de confirmação

---

### 2. Endereço de Administração: `/sistema` (Área Administrativa)

**Objetivo**: Gerenciar leads, follow-ups, dúvidas e configurações do sistema.

#### A. Tela de Login (`/sistema` ou `/sistema/login`)

- **Campos**:
  - Email (obrigatório)
  - Senha (obrigatório, tipo password)
  - Botão "Entrar"
- **Autenticação**:
  - Validar credenciais via JWT
  - Armazenar token de acesso
  - Redirecionar para dashboard específico do perfil

---

#### B. Dashboard ADMIN (`/sistema/dashboard`)

**Acesso**: Somente usuários com perfil `ADMIN`

**Funcionalidades**:

1. **CRUD Completo de Todas as Tabelas**:
   - **Usuários** (`users`)
     - Criar, visualizar, editar, ativar/desativar usuários
     - Definir perfil (ADMIN/OPERATOR)
     - Não pode alterar seu próprio perfil

   - **Interessados** (`interessados`)
     - Visualizar, editar, alterar status
     - Ver histórico de respostas de qualificação
     - Ver histórico de follow-ups

   - **Qualificação** (`qualificacao`)
     - Criar, editar, desativar perguntas
     - Definir obrigatoriedade
     - Definir opções de resposta

   - **Respostas** (`respostas`)
     - Visualizar respostas dos interessados
     - Apenas leitura (não permite edição)

   - **Dúvidas** (`duvidas`)
     - Visualizar dúvidas recebidas
     - Responder dúvidas (preencher campo `resposta`)
     - Alterar status

   - **Follow-up** (`followup`)
     - Criar novos follow-ups para interessados
     - Visualizar histórico completo
     - Editar follow-ups existentes

2. **Dashboards e Métricas** (opcional/futuro):
   - Total de leads por status
   - Taxa de conversão
   - Dúvidas pendentes
   - Follow-ups do dia

3. **Navegação**:
   - Menu lateral com acesso a todas as seções
   - Breadcrumbs para localização
   - Logout

---

#### C. Dashboard OPERATOR (`/sistema/dashboard`)

**Acesso**: Somente usuários com perfil `OPERATOR`

**Funcionalidades**:

1. **Dados Próprios**:
   - Pode visualizar e editar apenas seus próprios dados pessoais
   - **NÃO pode** alterar seu perfil

2. **Tabelas com Permissão de Edição**:

   - **Interessados** (`interessados`)
     - Visualizar todos os interessados
     - Editar dados dos interessados
     - Alterar status (lead → prospect → negotiation → win/lost/interrupted)
     - Ver respostas de qualificação (somente leitura)

   - **Dúvidas** (`duvidas`)
     - Visualizar todas as dúvidas
     - Responder dúvidas (preencher campo `resposta`)
     - Alterar status

   - **Follow-up** (`followup`)
     - Criar novos follow-ups para interessados
     - Visualizar histórico completo
     - Editar follow-ups criados por ele mesmo

3. **Tabelas Somente Leitura**:
   - **Qualificação** - apenas visualizar perguntas
   - **Respostas** - apenas visualizar respostas dos interessados

4. **Navegação**:
   - Menu lateral simplificado com acesso limitado
   - Breadcrumbs para localização
   - Logout

---

### Regras de Negócio Importantes

1. **Follow-ups**:
   - ADMIN e OPERATOR podem criar follow-ups
   - Sempre vincular a um interessado específico
   - Registrar canal utilizado
   - Timestamp automático (criado_em)

2. **Status de Interessados**:
   - Fluxo esperado: `lead` → `prospect` → `negotiation` → `win` ou `lost` ou `interrupted`
   - Permitir alteração direta entre quaisquer status (flexibilidade operacional)

3. **Status de Dúvidas**:
   - Criada como `feita` pela landing page
   - Operador/Admin altera para `respondida` após responder
   - Pode evoluir para `prospect` → `negotiation` → `win`/`lost`/`interrupted` se virar lead

4. **Perguntas de Qualificação**:
   - Armazenar texto literal nas respostas (não ID)
   - Motivo: perguntas podem mudar ao longo do tempo
   - Histórico preservado mesmo se pergunta for desativada

5. **Paginação**:
   - Todas as listagens devem ter paginação (10 itens por página)
   - Carregamento incremental do backend (200 em 200)

---

## 📁 Estrutura de Diretórios

```
captura_leads/
├── backend/
│   ├── src/
│   │   ├── common/
│   │   │   ├── decorators/       # Decorators customizados
│   │   │   ├── entities/          # Entidade base com auditoria
│   │   │   ├── enums/             # Enums do sistema
│   │   │   ├── filters/           # Exception filters
│   │   │   ├── guards/            # Guards de autorização
│   │   │   └── interceptors/      # Interceptors
│   │   ├── config/
│   │   │   └── typeorm.config.ts  # Configuração TypeORM
│   │   ├── database/
│   │   │   ├── migrations/        # Migrations TypeORM
│   │   │   └── seeds/             # Seeds do banco
│   │   ├── modules/
│   │   │   ├── auth/              # Autenticação JWT
│   │   │   ├── users/             # Gerenciamento de usuários
│   │   │   ├── interessados/      # Gerenciamento de interessados
│   │   │   ├── qualificacao/      # Perguntas de qualificação
│   │   │   ├── respostas/         # Respostas dos interessados
│   │   │   ├── duvidas/           # Dúvidas da landing page
│   │   │   └── followup/          # Follow-ups
│   │   ├── app.module.ts          # Módulo raiz
│   │   └── main.ts                # Entry point
│   ├── test/                      # Testes E2E
│   ├── .env.example               # Exemplo de variáveis de ambiente
│   ├── Dockerfile                 # Docker configuration
│   ├── nest-cli.json              # NestJS CLI config
│   ├── package.json               # Dependencies
│   └── tsconfig.json              # TypeScript config
│
├── frontend/
│   ├── src/
│   │   ├── components/            # Componentes reutilizáveis
│   │   │   ├── common/            # Componentes comuns
│   │   │   ├── landing/           # Componentes da landing page
│   │   │   └── sistema/           # Componentes do sistema
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx    # Landing page pública
│   │   │   ├── LoginPage.tsx      # Página de login
│   │   │   └── DashboardPage.tsx  # Dashboard administrativo
│   │   ├── services/              # Services para API calls
│   │   ├── hooks/                 # Custom hooks
│   │   ├── types/                 # TypeScript types
│   │   ├── utils/                 # Utilitários
│   │   ├── App.tsx                # App component
│   │   └── main.tsx               # Entry point
│   ├── public/                    # Arquivos estáticos
│   ├── .env.example               # Exemplo de variáveis de ambiente
│   ├── Dockerfile                 # Docker configuration
│   ├── index.html                 # HTML template
│   ├── package.json               # Dependencies
│   ├── tsconfig.json              # TypeScript config
│   └── vite.config.ts             # Vite config
│
├── .env.example                   # Variáveis de ambiente globais
├── .gitignore                     # Git ignore
├── CLAUDE.md                      # Documentação do projeto
├── docker-compose.yml             # Docker Compose config
├── package.json                   # Scripts raiz
└── README.md                      # README
```

---

## 🎨 Convenções de Código

### Nomenclatura

#### Arquivos
- **Componentes React**: PascalCase (ex: `UserProfile.tsx`)
- **Páginas React**: PascalCase com sufixo `Page` (ex: `DashboardPage.tsx`)
- **Hooks**: camelCase com prefixo `use` (ex: `useAuth.ts`)
- **Services**: camelCase com sufixo `.service` (ex: `auth.service.ts`)
- **Utils**: camelCase (ex: `formatDate.ts`)
- **Types**: camelCase com sufixo `.types` (ex: `user.types.ts`)
- **Constantes**: camelCase com sufixo `.constants` (ex: `api.constants.ts`)
- **Testes**: mesmo nome + `.spec.ts` ou `.test.tsx`

#### Código
- **Componentes/Classes**: PascalCase (ex: `UserProfile`, `AuthService`)
- **Interfaces**: PascalCase com prefixo `I` (ex: `IUser`, `IAuthResponse`)
- **Types**: PascalCase (ex: `UserRole`, `ApiResponse`)
- **Enums**: PascalCase (ex: `UserStatus`, `HttpMethod`)
- **Variáveis/Funções**: camelCase (ex: `getUserById`, `isAuthenticated`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `API_BASE_URL`, `MAX_RETRY_ATTEMPTS`)
- **Props Interfaces**: PascalCase com sufixo `Props` (ex: `UserCardProps`)
- **DTO Classes**: PascalCase com sufixo `Dto` (ex: `CreateUserDto`)

### Frontend - React + TypeScript

```typescript
// ✅ CORRETO: Functional component com TypeScript
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: IUser) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const data = await userService.getById(userId);
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{user.name}</h1>
    </div>
  );
};

// ❌ EVITAR: Class components
class UserProfile extends React.Component { }

// ❌ EVITAR: Componentes sem tipos
export const UserProfile = ({ userId }) => { }
```

### Backend - NestJS + TypeScript

```typescript
// ✅ CORRETO: Controller com decorators
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}

// ✅ CORRETO: Service com injeção de dependências
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}

// ✅ Custom exception filter (global)
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: 
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message,
    };

    response.status(status).json(errorResponse);
  }
}

// Aplicar globalmente no main.ts
app.useGlobalFilters(new HttpExceptionFilter());
```

### Frontend - Error Handling

```typescript
// ✅ Try-catch em chamadas async
const fetchUser = async (id: string) => {
  try {
    setLoading(true);
    setError(null);
    
    const user = await userService.getById(id);
    setUser(user);
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch user';
    setError(message);
    toast.error(message);
    console.error('Error fetching user:', error);
  } finally {
    setLoading(false);
  }
};

// ✅ Error Boundary para erros de renderização
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Algo deu errado
          </h1>
          <p className="mt-2">{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 🚨 REGRAS CRÍTICAS

### Regras de Autorização

**REGRA GERAL: Controle de acesso baseado em perfis de usuário.**

#### Perfis de Usuário

1. **ADMIN** - Administrador do sistema
   - Pode gerenciar todos os usuários
   - Tem acesso a todas as funcionalidades

2. **OPERATOR** - Operador
   - Só pode alterar seus próprios dados
   - Não pode alterar seu perfil
   - Operações específicas do negócio

#### Regras de Acesso

- **Usuários (Users)**:
  - CREATE: ADMIN (qualquer usuário)
  - READ:
    - ADMIN: Vê todos os usuários
    - OPERATOR: Vê apenas seus próprios dados
  - UPDATE:
    - ADMIN: Qualquer usuário
    - OPERATOR: Apenas seus próprios dados (exceto perfil)
  - DELETE: ADMIN (qualquer usuário)
  - ACTIVATE/DEACTIVATE: ADMIN

- **Interessados**:
  - CREATE:
    - Público (landing page)
    - ADMIN
    - OPERATOR
  - READ:
    - ADMIN: Todos
    - OPERATOR: Todos
  - UPDATE:
    - ADMIN: Todos os campos
    - OPERATOR: Todos os campos
  - DELETE: ADMIN (soft delete)

- **Qualificação**:
  - CREATE: ADMIN
  - READ:
    - Público (landing page - apenas ativas)
    - ADMIN: Todas
    - OPERATOR: Todas (somente leitura)
  - UPDATE: ADMIN
  - DELETE: ADMIN (soft delete)

- **Respostas**:
  - CREATE: Público (landing page via modal)
  - READ:
    - ADMIN: Todas
    - OPERATOR: Todas (somente leitura)
  - UPDATE: Não permitido (registro histórico)
  - DELETE: ADMIN (soft delete apenas)

- **Dúvidas**:
  - CREATE: Público (landing page)
  - READ:
    - ADMIN: Todas
    - OPERATOR: Todas
  - UPDATE:
    - ADMIN: Todos os campos
    - OPERATOR: Campos `resposta` e `status`
  - DELETE: ADMIN (soft delete)

- **Follow-up**:
  - CREATE:
    - ADMIN: Qualquer follow-up
    - OPERATOR: Qualquer follow-up
  - READ:
    - ADMIN: Todos
    - OPERATOR: Todos
  - UPDATE:
    - ADMIN: Todos os follow-ups
    - OPERATOR: Apenas follow-ups criados por ele
  - DELETE: ADMIN (soft delete) 



// ❌ ERRADO: Endpoint sem controle de acesso
@Post()
create(@Body() createCompanyDto: CreateCompanyDto) {
  return this.companiesService.create(createCompanyDto);
}
```

### Sistema de Auditoria

**REGRA GERAL: O sistema deve ser completamente auditável com rastreabilidade total.**

#### Princípios

1. **Nenhum registro é excluído permanentemente** - Usar soft delete
2. **Todas as alterações são registradas** - Tabela `audit_logs`
3. **Rastreabilidade completa** - Valores antes e depois de cada mudança
4. **Campos sensíveis são protegidos** - Passwords/tokens ocultados nos logs
5. **CRUD completo é auditado** - Todo CREATE, UPDATE e DELETE gera registro em `audit_logs`

**REGRA CRÍTICA: Qualquer operação de CRUD (Create, Read, Update, Delete) em qualquer tabela do sistema DEVE gerar automaticamente um registro na tabela `audit_logs`.**

- **CREATE**: Registra `action: INSERT` com os valores do novo registro em `newValues`
- **UPDATE**: Registra `action: UPDATE` com valores antigos em `oldValues` e novos em `newValues`, além de `changedFields`
- **DELETE/SOFT DELETE**: Registra `action: DELETE` com os valores do registro em `oldValues`
- **READ**: Não é auditado por questões de performance (exceto em casos críticos específicos)

Isso é implementado através de **TypeORM Subscribers** que escutam todos os eventos de banco de dados automaticamente.

#### Implementação

**Duas Camadas de Auditoria:**

1. **Soft Delete** - Registros nunca são removidos fisicamente
   - Campo `deletedAt` marca quando foi "excluído"
   - Campo `deletedBy` identifica quem excluiu
   - TypeORM automaticamente filtra registros deletados

2. **Audit Logs** - Histórico completo de todas as mudanças
   - INSERT: Registra valores novos
   - UPDATE: Registra valores antes e depois
   - DELETE: Registra valores antes da exclusão
   - Campos alterados são identificados
   - IP e User Agent podem ser capturados

```typescript
// ✅ Estrutura da tabela audit_logs
@Entity('audit_logs')
export class AuditLog {
  id: string;                    // UUID do log
  tableName: string;             // Nome da tabela afetada
  recordId: string;              // ID do registro afetado
  action: 'INSERT'|'UPDATE'|'DELETE';  // Tipo de operação
  oldValues?: Record<string,any>;      // Valores anteriores
  newValues?: Record<string,any>;      // Valores novos
  changedFields?: string[];            // Campos modificados
  userId?: string;                     // Quem fez a mudança
  ipAddress?: string;                  // IP da requisição
  userAgent?: string;                  // Navegador/cliente
  createdAt: Date;                     // Quando ocorreu
}

// ✅ Soft Delete em todos os services
async remove(id: string): Promise<void> {
  const company = await this.findOne(id);
  // Usa softDelete em vez de delete
  await this.companiesRepository.softDelete(company.id);
}

// ✅ Auditoria automática via TypeORM Subscribers
@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface<any> {
  constructor(private dataSource: DataSource) {}

  // Não implementar listenTo() para escutar TODAS as entidades

  async afterInsert(event: InsertEvent<any>) {
    // Registra INSERT na tabela audit_logs
    // Ignora audit_logs para evitar loop infinito
  }

  async afterUpdate(event: UpdateEvent<any>) {
    // Registra UPDATE com valores antigos e novos
    // Calcula changedFields automaticamente
  }

  async afterSoftRemove(event: SoftRemoveEvent<any>) {
    // Registra DELETE (soft)
  }

  async afterRemove(event: RemoveEvent<any>) {
    // Registra DELETE (hard - não recomendado)
  }
}

// ✅ IMPORTANTE: Subscriber deve ser registrado no typeorm.config.ts
export const getTypeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
  // ... outras configs
  subscribers: [AuditSubscriber, AuditLogSubscriber],
});

// ✅ Consultar histórico de auditoria
const history = await auditService.getAuditHistory('users', userId);
// Retorna todos os logs de mudanças para aquele usuário

// ✅ Verificar auditoria via SQL
-- Ver total de registros por ação
SELECT COUNT(*) as total, action FROM audit_logs GROUP BY action;

-- Ver últimos registros de auditoria
SELECT table_name, action, record_id, user_id, created_at
FROM audit_logs
ORDER BY created_at DESC
LIMIT 10;

-- Ver histórico de um registro específico
SELECT * FROM audit_logs
WHERE table_name = 'users' AND record_id = 'uuid-do-usuario'
ORDER BY created_at DESC;
```

#### Benefícios

- **Compliance**: Atende requisitos regulatórios (LGPD, SOX, etc.)
- **Debugging**: Facilita investigação de problemas
- **Segurança**: Detecta acessos não autorizados
- **Rollback**: Permite reverter mudanças se necessário
- **Análise**: Histórico completo para auditoria

#### Exceção: Tabela Users

A tabela `users` usa sistema de **ativação/desativação** em vez de soft delete:
- Campo `isActive` (true/false)
- Campo `deactivatedAt`
- Campo `deactivatedBy`
- Motivo: Segurança (usuários desativados não podem fazer login)

#### Foreign Keys de Auditoria

**REGRA GERAL: Todos os campos de auditoria devem ter Foreign Keys para a tabela `users`.**

Os campos `created_by`, `updated_by`, `deleted_by`, e `deactivated_by` em todas as tabelas devem:

1. **Ter Foreign Key** apontando para `users.id`
2. **Usar `onDelete: 'SET NULL'`** - Se o usuário for deletado, o campo vira NULL
3. **Ser nullable** - Permitir NULL quando o usuário não existe mais
4. **Usar lazy loading** - Para evitar referência circular com User entity

```typescript
// ✅ BaseEntity com FKs para auditoria
@ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
@JoinColumn({ name: 'created_by' })
createdByUser?: Promise<any>;

@RelationId((entity: BaseEntity) => entity.createdByUser)
createdBy?: string;  // Propriedade virtual com o ID

@ManyToOne('User', { nullable: true, onDelete: 'SET NULL', lazy: true })
@JoinColumn({ name: 'updated_by' })
updatedByUser?: Promise<any>;

@RelationId((entity: BaseEntity) => entity.updatedByUser)
updatedBy?: string;
```

**Benefícios:**
- ✅ **Integridade Referencial**: Banco garante que IDs são válidos
- ✅ **Validação Automática**: Impossível inserir user_id inexistente
- ✅ **Cascata Segura**: Se user deletado, campos ficam NULL (não falham)
- ✅ **Queries Otimizadas**: Índices nas FKs melhoram performance
- ✅ **Navegação**: Pode fazer JOIN para buscar dados do usuário que fez a ação

### Mensagens de Erro

**REGRA GERAL: Todas as mensagens de erro devem ser emitidas em português brasileiro.**

- Exceptions do backend devem ter mensagens em português
- Validações devem retornar erros em português
- Mensagens de feedback no frontend devem ser em português
- Textos de interface (labels, botões, placeholders) devem ser em português
- Logs de erro podem ser em português ou inglês técnico

```typescript
// ✅ BACKEND: Mensagens em português
throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
throw new BadRequestException('Formato de email inválido');
throw new UnauthorizedException('Credenciais inválidas');
throw new ConflictException('Email já existe');
throw new BadRequestException('Usuário já está desativado');

// ❌ BACKEND: Mensagens em inglês
throw new NotFoundException(`User with ID ${id} not found`);
throw new BadRequestException('Invalid email format');

// ✅ BACKEND: Validações class-validator em português
export class CreateUserDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email não pode estar vazio' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  password: string;
}

// ❌ BACKEND: Validações em inglês
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Erro: "name should not be empty"
}

// ✅ FRONTEND: Mensagens e textos em português
toast.error('Erro ao carregar dados');
toast.success('Usuário criado com sucesso');
setError('Falha ao fazer login. Verifique suas credenciais.');
<button>Salvar</button>
<input placeholder="Digite seu email" />

// ❌ FRONTEND: Mensagens em inglês
toast.error('Failed to load data');
toast.success('User created successfully');
setError('Login failed. Check your credentials.');
<button>Save</button>
<input placeholder="Enter your email" />
```

### Paginação de Tabelas

**REGRA GERAL: Todas as tabelas exibidas no frontend devem ter paginação.**

#### Requisitos de Paginação

1. **Frontend (Exibição)**:
   - Máximo de **10 elementos por página** na interface
   - Componente de paginação com navegação entre páginas
   - Indicação da página atual e total de páginas
   - Botões: Primeira, Anterior, Próxima, Última

2. **Backend (Carregamento)**:
   - Buscar registros em lotes de **200 em 200**
   - Quando a visualização ultrapassar os 200 registros carregados, fazer nova requisição
   - Cache local dos registros já carregados para evitar requisições repetidas

3. **Implementação**:

```typescript
// ✅ FRONTEND: Paginação com carregamento incremental
interface PaginationState {
  currentPage: number;        // Página atual (interface)
  itemsPerPage: number;       // 10 itens por página
  totalItems: number;         // Total de registros
  loadedItems: any[];         // Registros carregados do backend
  backendOffset: number;      // Offset para próxima carga do backend
  backendLimit: number;       // 200 registros por lote
}

const [pagination, setPagination] = useState<PaginationState>({
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  loadedItems: [],
  backendOffset: 0,
  backendLimit: 200,
});

// Calcular registros da página atual
const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
const endIndex = startIndex + pagination.itemsPerPage;
const currentPageItems = pagination.loadedItems.slice(startIndex, endIndex);

// Verificar se precisa carregar mais registros
useEffect(() => {
  const needMoreData = endIndex >= pagination.loadedItems.length
    && pagination.loadedItems.length < pagination.totalItems;

  if (needMoreData) {
    loadMoreFromBackend();
  }
}, [pagination.currentPage]);

const loadMoreFromBackend = async () => {
  const { data, total } = await api.get('/users', {
    params: {
      offset: pagination.backendOffset,
      limit: pagination.backendLimit,
    },
  });

  setPagination(prev => ({
    ...prev,
    loadedItems: [...prev.loadedItems, ...data],
    backendOffset: prev.backendOffset + prev.backendLimit,
    totalItems: total,
  }));
};

// Componente de paginação
<div className="flex items-center justify-between mt-4">
  <p className="text-sm text-gray-600">
    Exibindo {startIndex + 1} a {Math.min(endIndex, pagination.totalItems)} de {pagination.totalItems} registros
  </p>

  <div className="flex gap-2">
    <button
      onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
      disabled={pagination.currentPage === 1}
    >
      Primeira
    </button>
    <button
      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
      disabled={pagination.currentPage === 1}
    >
      Anterior
    </button>
    <span>Página {pagination.currentPage} de {Math.ceil(pagination.totalItems / pagination.itemsPerPage)}</span>
    <button
      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
      disabled={pagination.currentPage >= Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
    >
      Próxima
    </button>
    <button
      onClick={() => setPagination(prev => ({
        ...prev,
        currentPage: Math.ceil(pagination.totalItems / pagination.itemsPerPage)
      }))}
      disabled={pagination.currentPage >= Math.ceil(pagination.totalItems / pagination.itemsPerPage)}
    >
      Última
    </button>
  </div>
</div>
```

```typescript
// ✅ BACKEND: Suporte a paginação
@Get()
async findAll(
  @Query('offset') offset: number = 0,
  @Query('limit') limit: number = 200,
  @CurrentUser() currentUser: any,
) {
  const [data, total] = await this.usersRepository.findAndCount({
    skip: offset,
    take: Math.min(limit, 200), // Máximo 200 por requisição
    order: { createdAt: 'DESC' },
  });

  return {
    data,
    total,
    offset,
    limit,
  };
}
```

#### Benefícios:
- ✅ **Performance**: Carrega apenas dados necessários
- ✅ **UX**: Navegação rápida entre páginas
- ✅ **Escalabilidade**: Funciona com milhares de registros
- ✅ **Economia**: Reduz tráfego de rede e uso de memória

### NUNCA Commitar

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Build outputs
dist/
build/
.next/
out/

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.sqlite

# Logs
logs/
*.log

# Test coverage
coverage/

# Docker
.dockerignore
```

### SEMPRE Fazer

1. **Validar entrada do usuário**
   - Frontend: Zod schemas + React Hook Form
   - Backend: class-validator DTOs

2. **Sanitizar dados**
   - Usar ORM (TypeORM) - evita SQL injection
   - Validar tipos TypeScript
   - Limitar tamanho de payloads

3. **Autenticação & Autorização**
   - JWT com refresh tokens
   - Guards em rotas protegidas (JwtAuthGuard)
   - Controle de acesso por perfil (RolesGuard + @Roles decorator)
   - HTTPS em produção
   - Rate limiting em endpoints públicos

4. **Logging apropriado**
   ```typescript
   // ✅ CORRETO: Log sem dados sensíveis
   logger.log('User logged in', { userId: user.id });
   
   // ❌ ERRADO: Log com dados sensíveis
   logger.log('User logged in', { password: user.password });
   ```

5. **Variáveis de Ambiente**
   - Criar `.env.example` com placeholders
   - Validar vars na inicialização
   - Nunca hardcode secrets


## 💡 Instruções Específicas para Claude

### Ao gerar código, SEMPRE:

1. **Use TypeScript strict**
   - Nunca use `any` - sempre defina tipos específicos
   - Interfaces para objetos complexos
   - Enums para valores fixos
   - Genéricos quando apropriado

2. **Inclua tipos/interfaces**
   ```typescript
   // ✅ SEMPRE assim
   interface User {
     id: string;
     name: string;
     email: string;
   }
   
   const getUser = async (id: string): Promise<User> => {
     // ...
   };
   
   // ❌ NUNCA assim
   const getUser = async (id) => {
     // ...
   };
   ```

3. **Siga a estrutura de pastas**
   - Componentes em `/components`
   - Páginas em `/pages`
   - Services em `/services`
   - Types em `/types`

4. **Adicione comentários apenas quando necessário**
   ```typescript
   // ✅ Bom: explica lógica complexa
   // Calcula hash usando salt rounds de 10 para melhor performance
   const hash = await bcrypt.hash(password, 10);
   
   // ❌ Ruim: comenta o óbvio
   // Define a variável name
   const name = 'John';
   ```

5. **Implemente tratamento de erros**
   - Try-catch em operações async
   - Validação de entrada
   - Mensagens de erro úteis
   - Never fail silently

6. **Gere testes junto com código**
   - Teste unitário para cada service/função
   - Teste de componente para React
   - Coverage mínimo: 80%

7. **Use async/await** (não .then/.catch)
   ```typescript
   // ✅ CORRETO
   const user = await userService.getById(id);
   
   // ❌ EVITAR
   userService.getById(id).then(user => { });
   ```

8. **Prefira composição sobre herança**
   - Functional components com hooks
   - Composition pattern para reutilização

9. **Funções pequenas e focadas**
   - Uma responsabilidade por função
   - Máximo ~20-30 linhas
   - Nomes descritivos

10. **Valide SEMPRE dados de entrada**
    ```typescript
    // Backend
    @IsEmail()
    @IsNotEmpty()
    email: string;

    // Frontend
    const schema = z.object({
      email: z.string().email(),
    });
    ```

11. **Implemente paginação em todas as tabelas**
    - Máximo de **10 itens por página** na interface
    - Carregar do backend em lotes de **200 registros**
    - Carregar mais 200 quando necessário (carregamento incremental)
    - Componente de paginação com: Primeira, Anterior, Próxima, Última
    - Indicador de "Exibindo X a Y de Z registros"

12. **Use mensagens em português**
    - Todas as mensagens de erro, validação e feedback em português brasileiro
    - Traduzir mensagens padrão do class-validator
    - Textos de interface (labels, botões, placeholders) em português

### Ao sugerir mudanças:

1. **Explique o porquê**
   ```
   Vou mudar de useState para useReducer porque:
   - Estado complexo com múltiplas sub-values
   - Lógica de atualização complexa
   - Facilita testes
   ```

2. **Mostre antes/depois se relevante**
   ```typescript
   // Antes
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   
   // Depois
   const [state, dispatch] = useReducer(userReducer, initialState);
   ```

3. **Indique side effects**
   ```
   ⚠️ Esta mudança requer:
   - Executar migration: npm run migration:run
   - Atualizar seed scripts
   - Modificar testes relacionados
   ```

4. **Sugira testes**
   ```
   Para validar esta mudança:
   - Teste que user não autenticado é redirecionado
   - Teste que token expirado é renovado
   - Teste de integração do fluxo completo
   ```

### Padrões de Resposta

Quando eu pedir para criar algo:

1. **Confirme o entendimento**
   ```
   Vou criar um módulo de Posts com:
   - Entity Post (título, conteúdo, autor)
   - CRUD completo no backend
   - Interface no frontend
   - Testes unitários
   
   Está correto?
   ```

2. **Liste os arquivos que serão criados/modificados**
   ```
   Arquivos a criar:
   - backend/src/modules/posts/posts.entity.ts
   - backend/src/modules/posts/posts.service.ts
   - backend/src/modules/posts/posts.controller.ts
   - backend/src/modules/posts/dto/create-post.dto.ts
   - frontend/src/pages/posts/PostsPage.tsx
   - frontend/src/services/posts.service.ts
   ```

3. **Gere código completo e funcional**
   - Não use placeholders ou "// TODO"
   - Código pronto para executar
   - Com imports corretos
   - Com tratamento de erros

4. **Indique próximos passos**
   ```
   Próximos passos:
   1. Gerar migration: npm run migration:generate -- -n CreatePosts
   2. Executar migration: npm run migration:run
   3. Testar endpoints: npm run test:e2e
   4. Verificar UI: npm run dev
   ```

---

## 🔗 Recursos e Documentação

### Documentação Oficial
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Vite**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **NestJS**: https://docs.nestjs.com
- **TypeORM**: https://typeorm.io
- **PostgreSQL**: https://www.postgresql.org/docs

### Bibliotecas Principais
- **React Router**: https://reactrouter.com
- **Zustand**: https://zustand-demo.pmnd.rs
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev
- **Axios**: https://axios-http.com
- **TanStack Query**: https://tanstack.com/query

### UI & Styling
- **shadcn/ui**: https://ui.shadcn.com
- **Lucide Icons**: https://lucide.dev
- **Radix UI**: https://www.radix-ui.com

### Testing
- **Vitest**: https://vitest.dev
- **React Testing Library**: https://testing-library.com/react
- **Jest**: https://jestjs.io
- **Supertest**: https://github.com/ladjs/supertest

### Tools
- **Docker**: https://docs.docker.com
- **PostgreSQL Admin**: pgAdmin / DBeaver
- **API Testing**: Postman / Insomnia / Thunder Client
- **Swagger UI**: http://localhost:3000/api (em desenvolvimento)

---

## ✅ Code Review Checklist

Antes de commitar, verificar:

- [ ] **Código**
  - [ ] TypeScript sem erros (`npm run type-check`)
  - [ ] Sem `any` types
  - [ ] Sem `console.log` ou `debugger`
  - [ ] Sem código comentado
  - [ ] Imports otimizados

- [ ] **Qualidade**
  - [ ] ESLint passou (`npm run lint`)
  - [ ] Prettier aplicado (`npm run format`)
  - [ ] Testes passam (`npm run test`)
  - [ ] Coverage adequado (>80%)

- [ ] **Funcionalidade**
  - [ ] Feature funciona como esperado
  - [ ] Tratamento de erros implementado
  - [ ] Validação de dados presente
  - [ ] Loading states implementados
  - [ ] Mensagens de feedback ao usuário

- [ ] **Database** (se aplicável)
  - [ ] Migration criada
  - [ ] Migration testada
  - [ ] Seed atualizado
  - [ ] Índices criados quando necessário

- [ ] **Documentação**
  - [ ] README atualizado (se necessário)
  - [ ] Swagger/JSDoc atualizado
  - [ ] CHANGELOG atualizado
  - [ ] Variáveis de ambiente documentadas

- [ ] **Git**
  - [ ] Mensagem de commit descritiva
  - [ ] Branch nomeada corretamente
  - [ ] Sem arquivos desnecessários
  - [ ] `.env` não commitado

---

## 🎓 Exemplos de Uso

### Criar novo módulo completo

```bash
> Crie um módulo de Posts com:
> - Backend: Entity, Service, Controller, DTOs
> - Relacionamento com User (autor)
> - Endpoints CRUD protegidos
> - Frontend: Página de lista e formulário
> - Testes unitários
```

### Adicionar feature específica

```bash
> Adicione paginação na listagem de posts:
> - Backend: query params page/limit
> - Frontend: componente de paginação
> - Manter no padrão do projeto
```

### Debug e correção

```bash
> Estou recebendo erro 401 no login.
> Verifique o fluxo de autenticação e corrija
```

### Refatoração

```bash
> Refatore o UserService para usar repository patterns
> Mantenha todos os testes passando
```

---

## 📝 Notas Finais

Este CLAUDE.md deve evoluir com o projeto. Use a tecla `#` durante conversas com Claude para adicionar instruções que você se pega repetindo.

**Mantenha este arquivo:**
- ✅ Conciso (< 300 linhas idealmente)
- ✅ Atualizado
- ✅ Focado no essencial
- ✅ Com exemplos práticos

**Este arquivo define:**
- Stack completa
- Estrutura de pastas
- Convenções de código
- Comandos principais
- Padrões de segurança
- Como Claude deve se comportar

Qualquer dúvida, consulte este arquivo primeiro!
