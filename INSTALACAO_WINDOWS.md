# Roteiro de Instalação - Windows

Este guia descreve passo a passo como clonar e executar o projeto **Sistema de Captura de Leads** em uma máquina Windows usando Docker.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### 1. Git para Windows
- **Download**: https://git-scm.com/download/win
- **Instalação**: Execute o instalador e siga as opções padrão
- **Verificar instalação**:
  ```powershell
  git --version
  ```

### 2. Docker Desktop para Windows
- **Download**: https://www.docker.com/products/docker-desktop/
- **Requisitos**:
  - Windows 10/11 64-bit: Pro, Enterprise ou Education (Build 19044 ou superior)
  - Habilitar WSL 2 (Windows Subsystem for Linux 2)
  - Virtualização habilitada na BIOS
- **Instalação**:
  1. Execute o instalador Docker Desktop
  2. Durante a instalação, marque "Use WSL 2 instead of Hyper-V"
  3. Reinicie o computador quando solicitado
  4. Abra o Docker Desktop e aguarde inicialização completa
- **Verificar instalação**:
  ```powershell
  docker --version
  docker-compose --version
  ```

### 3. Terminal (Opcional, mas recomendado)
- **Windows Terminal** (recomendado): Disponível na Microsoft Store
- **Alternativa**: Use o PowerShell padrão do Windows

---

## 🚀 Passo a Passo da Instalação

### Passo 1: Clonar o Repositório

1. Abra o **PowerShell** ou **Windows Terminal**

2. Navegue até a pasta onde deseja clonar o projeto:
   ```powershell
   cd C:\Users\SeuUsuario\Documents
   ```

3. Clone o repositório do GitHub:
   ```powershell
   git clone https://github.com/jrsguarata/captura_leads.git
   ```

4. Entre na pasta do projeto:
   ```powershell
   cd captura_leads
   ```

### Passo 2: Configurar Variáveis de Ambiente

1. Crie o arquivo `.env` no backend:
   ```powershell
   cd backend
   copy .env.example .env
   ```

2. **(Opcional)** Edite o arquivo `.env` se necessário:
   ```powershell
   notepad .env
   ```

   **Nota**: As configurações padrão já funcionam perfeitamente com o Docker Compose.

3. Volte para a raiz do projeto:
   ```powershell
   cd ..
   ```

### Passo 3: Inicializar o Docker

1. **Certifique-se de que o Docker Desktop está rodando**:
   - Verifique o ícone do Docker na bandeja do sistema (system tray)
   - O ícone deve estar ativo (não esmaecido)

2. Na raiz do projeto, construa e inicie os containers:
   ```powershell
   docker-compose up -d --build
   ```

   **Explicação dos parâmetros**:
   - `up`: Inicia os containers
   - `-d`: Executa em background (detached mode)
   - `--build`: Reconstrói as imagens antes de iniciar

3. Aguarde o processo completar. Isso pode levar alguns minutos na primeira vez (download de imagens, instalação de dependências).

### Passo 4: Verificar Status dos Containers

1. Verificar se os containers estão rodando:
   ```powershell
   docker-compose ps
   ```

   **Saída esperada**:
   ```
   NAME                        STATUS              PORTS
   captura_leads_backend       Up X minutes        0.0.0.0:3001->3000/tcp
   captura_leads_db            Up X minutes        0.0.0.0:5434->5432/tcp
   captura_leads_frontend      Up X minutes        0.0.0.0:5174->5173/tcp
   ```

2. Verificar logs dos containers (opcional):
   ```powershell
   # Ver todos os logs
   docker-compose logs

   # Ver logs de um serviço específico
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs postgres

   # Ver logs em tempo real (seguir)
   docker-compose logs -f
   ```

### Passo 5: Executar Migrations do Banco de Dados

1. Execute as migrations para criar as tabelas:
   ```powershell
   docker-compose exec backend npm run migration:run
   ```

2. **(Opcional)** Popular o banco com dados iniciais (seeds):
   ```powershell
   docker-compose exec backend npm run seed
   ```

### Passo 6: Criar Usuário Administrador

1. Crie o primeiro usuário ADMIN via API:

   **Opção A: Usando PowerShell (método mais simples)**
   ```powershell
   $body = @{
       nome = "Administrador"
       email = "admin@capturaleads.com"
       password = "admin123"
       perfil = "ADMIN"
   } | ConvertTo-Json

   Invoke-RestMethod -Uri "http://localhost:3001/users" -Method POST -Body $body -ContentType "application/json"
   ```

   **Opção B: Usando curl (se instalado)**
   ```powershell
   curl -X POST http://localhost:3001/users `
     -H "Content-Type: application/json" `
     -d '{\"nome\":\"Administrador\",\"email\":\"admin@capturaleads.com\",\"password\":\"admin123\",\"perfil\":\"ADMIN\"}'
   ```

   **Opção C: Usando Postman ou Insomnia**
   - URL: `http://localhost:3001/users`
   - Método: `POST`
   - Headers: `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "nome": "Administrador",
       "email": "admin@capturaleads.com",
       "password": "admin123",
       "perfil": "ADMIN"
     }
     ```

### Passo 7: Acessar a Aplicação

1. **Landing Page (Pública)**:
   ```
   http://localhost:5174
   ```

2. **Sistema Administrativo**:
   ```
   http://localhost:5174/sistema
   ```

   **Credenciais padrão**:
   - Email: `admin@capturaleads.com`
   - Senha: `admin123`

3. **API Backend (Swagger)**:
   ```
   http://localhost:3001/api
   ```

4. **Banco de Dados PostgreSQL**:
   - Host: `localhost`
   - Porta: `5434`
   - Usuário: `postgres`
   - Senha: `postgres`
   - Database: `captura_leads`

   **Cliente recomendado**: [DBeaver](https://dbeaver.io/download/) ou [pgAdmin](https://www.pgadmin.org/download/)

---

## 🔧 Comandos Úteis

### Gerenciamento de Containers

```powershell
# Parar todos os containers
docker-compose stop

# Parar e remover containers
docker-compose down

# Parar e remover containers + volumes (CUIDADO: apaga dados do banco)
docker-compose down -v

# Reiniciar containers
docker-compose restart

# Reiniciar um serviço específico
docker-compose restart backend

# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Reconstruir e reiniciar containers
docker-compose up -d --build
```

### Acesso aos Containers

```powershell
# Acessar shell do backend
docker-compose exec backend sh

# Acessar shell do frontend
docker-compose exec frontend sh

# Acessar PostgreSQL
docker-compose exec postgres psql -U postgres -d captura_leads
```

### Migrations e Seeds

```powershell
# Executar migrations
docker-compose exec backend npm run migration:run

# Reverter última migration
docker-compose exec backend npm run migration:revert

# Gerar nova migration
docker-compose exec backend npm run migration:generate -- -n NomeDaMigration

# Executar seeds
docker-compose exec backend npm run seed
```

### Desenvolvimento

```powershell
# Ver logs do backend
docker-compose logs -f backend

# Ver logs do frontend
docker-compose logs -f frontend

# Instalar nova dependência no backend
docker-compose exec backend npm install nome-do-pacote

# Instalar nova dependência no frontend
docker-compose exec frontend npm install nome-do-pacote
```

---

## 🐛 Solução de Problemas

### Problema: Docker Desktop não inicia

**Solução**:
1. Verifique se a virtualização está habilitada na BIOS
2. Certifique-se de que o WSL 2 está instalado:
   ```powershell
   wsl --install
   wsl --set-default-version 2
   ```
3. Reinicie o computador

### Problema: Porta já em uso (3001, 5174 ou 5434)

**Solução**:
1. Identifique o processo usando a porta:
   ```powershell
   netstat -ano | findstr :3001
   ```
2. Mate o processo ou altere a porta no `docker-compose.yml`

### Problema: Containers não sobem ou ficam reiniciando

**Solução**:
1. Verifique os logs:
   ```powershell
   docker-compose logs
   ```
2. Reconstrua os containers:
   ```powershell
   docker-compose down
   docker-compose up -d --build
   ```

### Problema: Erro de conexão com banco de dados

**Solução**:
1. Verifique se o container do PostgreSQL está rodando:
   ```powershell
   docker-compose ps postgres
   ```
2. Aguarde alguns segundos para o banco inicializar completamente
3. Reinicie o backend:
   ```powershell
   docker-compose restart backend
   ```

### Problema: Frontend não conecta com backend

**Solução**:
1. Verifique se a variável `VITE_API_URL` está correta:
   ```powershell
   docker-compose exec frontend printenv | findstr VITE
   ```
2. Deve retornar: `VITE_API_URL=http://localhost:3001`

### Problema: Mudanças no código não aparecem

**Solução**:
1. Os volumes estão configurados para hot-reload, mas se não funcionar:
   ```powershell
   docker-compose restart backend
   docker-compose restart frontend
   ```

### Problema: Erro de permissão ao executar comandos

**Solução**:
1. Execute o PowerShell como Administrador:
   - Botão direito no PowerShell → "Executar como Administrador"

---

## 📁 Estrutura de Portas

| Serviço    | Porta Interna | Porta Externa | URL de Acesso              |
|------------|---------------|---------------|----------------------------|
| Frontend   | 5173          | 5174          | http://localhost:5174      |
| Backend    | 3000          | 3001          | http://localhost:3001      |
| PostgreSQL | 5432          | 5434          | localhost:5434             |
| Swagger    | -             | -             | http://localhost:3001/api  |

---

## 🔒 Segurança

**IMPORTANTE**: As credenciais padrão são apenas para desenvolvimento local.

Antes de colocar em produção:

1. Altere as senhas do banco de dados no `docker-compose.yml`
2. Altere os secrets JWT no arquivo `.env` do backend
3. Altere a senha do usuário administrador
4. Configure HTTPS
5. Configure CORS adequadamente
6. Use variáveis de ambiente seguras

---

## 📚 Próximos Passos

Após a instalação bem-sucedida:

1. ✅ Explore a landing page em `http://localhost:5174`
2. ✅ Faça login no sistema administrativo em `http://localhost:5174/sistema`
3. ✅ Explore a documentação da API em `http://localhost:3001/api`
4. ✅ Configure perguntas de qualificação
5. ✅ Teste o fluxo de captura de leads
6. ✅ Configure operadores no sistema

---

## 🆘 Precisa de Ajuda?

- Documentação completa: `CLAUDE.md`
- README do projeto: `README.md`
- Issues no GitHub: https://github.com/jrsguarata/captura_leads/issues

---

## 📝 Notas Importantes

- **Primeira execução**: A construção dos containers pode levar 5-10 minutos
- **Hot Reload**: Mudanças no código são detectadas automaticamente
- **Dados persistentes**: Os dados do banco ficam salvos mesmo após parar os containers
- **Logs**: Use `docker-compose logs -f` para acompanhar a execução em tempo real
- **Performance**: O Docker Desktop no Windows pode consumir bastante memória. Configure limites nas configurações do Docker se necessário.

---

**Versão**: 1.0
**Data**: Janeiro 2026
**Sistema Operacional**: Windows 10/11
