# Configuração Docker

## Problema: Portas Conflitantes

Você tem outro projeto (solar) usando as portas padrão 3000 e 5173. Por isso, este projeto foi configurado com portas alternativas:

- **Backend:** `http://localhost:3001` (ao invés de 3000)
- **Frontend:** `http://localhost:5174` (ao invés de 5173)
- **PostgreSQL:** Porta 5434 (se usar container) ou 5432 (se usar local)

## Opções de Setup

### Opção 1: Usar PostgreSQL Local (Configuração Atual)

Você está usando `docker-compose.local-db.yml` que conecta ao seu PostgreSQL local.

**Problema:** O PostgreSQL local não aceita conexões do Docker por padrão.

**Solução:**

1. Editar o arquivo `/etc/postgresql/16/main/postgresql.conf`:
```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```

2. Alterar a linha:
```
listen_addresses = 'localhost'
```
Para:
```
listen_addresses = '*'
```

3. Editar o arquivo `/etc/postgresql/16/main/pg_hba.conf`:
```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

4. Adicionar no final do arquivo:
```
host    all             all             172.17.0.0/16           md5
```

5. Reiniciar o PostgreSQL:
```bash
sudo systemctl restart postgresql
```

6. Criar o banco se não existir:
```bash
createdb captura_leads
```

7. Subir os containers:
```bash
docker-compose -f docker-compose.local-db.yml up -d
```

### Opção 2: Usar PostgreSQL no Docker (Mais Simples)

Use o `docker-compose.yml` que já inclui o PostgreSQL:

```bash
docker-compose up -d
```

Isso vai criar:
- PostgreSQL na porta 5434
- Backend na porta 3001
- Frontend na porta 5174

**Acessos:**
- Frontend: http://localhost:5174
- Backend API: http://localhost:3001
- Swagger: http://localhost:3001/api
- PostgreSQL: localhost:5434

## Comandos Úteis

```bash
# Ver status dos containers
docker-compose ps
# ou
docker-compose -f docker-compose.local-db.yml ps

# Ver logs
docker logs captura_leads_backend
docker logs captura_leads_frontend

# Parar containers
docker-compose down
# ou
docker-compose -f docker-compose.local-db.yml down

# Rebuild e restart
docker-compose up -d --build
# ou
docker-compose -f docker-compose.local-db.yml up -d --build

# Acessar shell do container
docker exec -it captura_leads_backend sh
docker exec -it captura_leads_frontend sh
```

## Após Containers Rodando

1. **Rodar migrations** (primeira vez):
```bash
docker exec -it captura_leads_backend npm run migration:run
```

2. **Popular banco com seeds**:
```bash
docker exec -it captura_leads_backend npm run seed
```

3. **Acessar a aplicação**:
- Frontend: http://localhost:5174
- Swagger API: http://localhost:3001/api

## Alternativa: Rodar Localmente (Sem Docker)

Se preferir não usar Docker:

```bash
# 1. Instalar dependências
cd backend && npm install
cd ../frontend && npm install

# 2. Configurar .env
cp .env.example .env
# Editar com suas configurações

# 3. Criar banco
createdb captura_leads

# 4. Rodar migrations
cd backend
npm run migration:run

# 5. Popular banco
npm run seed

# 6. Iniciar backend (terminal 1)
npm run start:dev

# 7. Iniciar frontend (terminal 2)
cd ../frontend
npm run dev
```

Assim você usa:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5432 (seu local)
