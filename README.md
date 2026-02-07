# MailForge

Email Campaign Tool SaaS - MVP

## Stack Tecnológica

- **Backend:** Java 17 + Spring Boot 3
- **Frontend:** React 18 + TypeScript
- **Banco de Dados:** PostgreSQL
- **Cache/Fila:** Redis
- **Containerização:** Docker + Docker Compose

## Funcionalidades MVP

### Backend
- ✅ API de Envio de Emails (individual e em massa)
- ✅ Gestão de Contatos (CRUD, importação CSV, segmentação)
- ✅ Campanhas (CRUD, agendamento, status)
- ✅ Analytics (tracking opens/clicks, dashboard stats)
- ✅ Configuração SMTP (múltiplos providers)

### Frontend
- ✅ Dashboard com métricas
- ✅ Páginas: Dashboard, Contatos, Campanhas, Templates, Configurações
- ✅ Tema escuro/claro
- ✅ Design moderno e minimalista

## Como Rodar

### Pré-requisitos
- Docker e Docker Compose instalados

### Iniciar aplicação

```bash
docker-compose up -d
```

Isso irá subir:
- **Backend:** http://localhost:8080
- **Frontend:** http://localhost:3000
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

### Configurar SMTP (Opcional)

Por padrão, emails são logados no console. Para enviar emails reais, configure as variáveis de ambiente no `docker-compose.yml`:

```yaml
environment:
  - MAIL_PROVIDER=resend  # ou sendgrid, ses, smtp
  - MAIL_API_KEY=sua-api-key
  - MAIL_FROM=seu@email.com
```

### Desenvolvimento

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Estrutura do Projeto

```
mailforge/
├── backend/           # Spring Boot Application
│   ├── src/main/java/com/mailforge/
│   │   ├── config/    # Configurações
│   │   ├── controller/# REST Controllers
│   │   ├── model/     # Entidades JPA
│   │   ├── repository/# Repositórios
│   │   ├── service/   # Lógica de negócio
│   │   └── MailForgeApplication.java
│   └── pom.xml
├── frontend/          # React Application
│   ├── src/
│   │   ├── components/# Componentes reutilizáveis
│   │   ├── pages/     # Páginas
│   │   └── App.tsx
│   └── package.json
└── docker-compose.yml
```

## API Endpoints

### Contatos
- `GET /api/contacts` - Listar contatos
- `POST /api/contacts` - Criar contato
- `PUT /api/contacts/{id}` - Atualizar contato
- `DELETE /api/contacts/{id}` - Remover contato
- `POST /api/contacts/import` - Importar CSV

### Campanhas
- `GET /api/campaigns` - Listar campanhas
- `POST /api/campaigns` - Criar campanha
- `PUT /api/campaigns/{id}` - Atualizar campanha
- `DELETE /api/campaigns/{id}` - Remover campanha
- `POST /api/campaigns/{id}/send` - Enviar campanha

### Emails
- `POST /api/emails/send` - Enviar email individual
- `POST /api/emails/send-bulk` - Enviar em massa

### Analytics
- `GET /api/analytics/dashboard` - Estatísticas do dashboard
- `GET /api/analytics/campaigns/{id}` - Estatísticas da campanha

## Licença

MIT
