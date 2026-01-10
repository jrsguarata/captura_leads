# Configurar DBeaver para Captura Leads

## Problema
Você está vendo o database "postgres" vazio ao invés do database "captura_leads" com as tabelas.

## Solução

### Passo 1: Editar Conexão

1. No DBeaver, clique com **botão direito** na sua conexão PostgreSQL
2. Selecione **"Edit Connection"**

### Passo 2: Configurar Database Correto

Na aba **Main**, configure:

```
Connection Settings:
┌─────────────────────────────────────┐
│ Host:     localhost                 │
│ Port:     5434                      │
│ Database: captura_leads   ← AQUI!  │
│ Username: postgres                  │
│ Password: postgres                  │
└─────────────────────────────────────┘
```

**IMPORTANTE:** O campo **Database** deve conter `captura_leads` (não deixe vazio ou "postgres")

### Passo 3: Testar e Salvar

1. Clique em **"Test Connection"** - deve aparecer "Connected"
2. Clique em **"OK"** para salvar

### Passo 4: Visualizar Tabelas

Após conectar, na árvore do DBeaver:

```
📁 PostgreSQL - localhost:5434
  └─📁 Databases
      └─📁 captura_leads          ← Este é o database correto
          └─📁 Schemas
              └─📁 public
                  └─📁 Tables
                      ├─ duvidas
                      ├─ followup
                      ├─ interessados
                      ├─ qualificacao
                      ├─ respostas
                      └─ users
```

## Verificação Rápida

Execute este SQL no DBeaver para confirmar que está no database correto:

```sql
-- Deve retornar "captura_leads"
SELECT current_database();

-- Deve listar as 6 tabelas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Resultado esperado:
```
table_name
--------------
duvidas
followup
interessados
qualificacao
respostas
users
```

## Conexão String Completa

Se preferir usar a string de conexão direta:

```
jdbc:postgresql://localhost:5434/captura_leads?user=postgres&password=postgres
```

## Problema Comum

❌ **ERRADO:** Database deixado em branco ou "postgres"
```
Database: [vazio]  ou  Database: postgres
```

✅ **CORRETO:** Database especificado como "captura_leads"
```
Database: captura_leads
```

## Comandos PostgreSQL Úteis

Depois de conectar no database correto:

```sql
-- Listar todas as tabelas
\dt

-- Ver estrutura de uma tabela
\d users

-- Contar registros
SELECT COUNT(*) FROM users;

-- Ver colunas de todas as tabelas
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

## Dados de Conexão

```
Host:     localhost
Port:     5434
Database: captura_leads
User:     postgres
Password: postgres
SSL:      disable (ou prefer)
```

---

**Nota:** Se você ainda vê o database "postgres", significa que o campo Database na conexão está configurado como "postgres" ao invés de "captura_leads".
