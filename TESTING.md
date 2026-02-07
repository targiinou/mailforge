# Testando o MailForge

Este documento descreve como testar o MailForge localmente.

## Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose instalado
- Git (opcional, para clonar o repositório)

## Passos para testar

### 1. Clone o repositório (se ainda não tiver)

```bash
git clone https://github.com/targiinou/mailforge.git
cd mailforge
```

### 2. Inicie os serviços

```bash
docker-compose up -d --build
```

Este comando irá:
- Baixar as imagens do PostgreSQL e Redis
- Construir a imagem do backend (Spring Boot)
- Construir a imagem do frontend (React)
- Iniciar todos os serviços

### 3. Aguarde a inicialização

A primeira execução pode demorar alguns minutos pois precisa:
1. Baixar as imagens base
2. Compilar o backend Java
3. Instalar as dependências do frontend
4. Executar as migrations do Flyway

Você pode acompanhar os logs:

```bash
# Ver todos os logs
docker-compose logs -f

# Ver logs específicos do backend
docker-compose logs -f backend

# Ver logs específicos do frontend
docker-compose logs -f frontend
```

### 4. Acesse a aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **API Docs (Swagger):** http://localhost:8080/swagger-ui.html

### 5. Teste as funcionalidades

#### Criar um Contato

1. Acesse http://localhost:3000/contacts
2. Clique em "Novo Contato"
3. Preencha:
   - Nome: "João Silva"
   - Email: "joao@exemplo.com"
   - Tags: "cliente, newsletter"
4. Clique em "Criar"

#### Criar uma Campanha

1. Acesse http://localhost:3000/campaigns
2. Clique em "Nova Campanha"
3. Preencha:
   - Nome: "Newsletter Janeiro"
   - Assunto: "Novidades do mês!"
   - Conteúdo: `<h1>Olá {{name}}!</h1><p>Confira nossas novidades.</p>`
   - Selecione as tags de segmentação
4. Clique em "Criar"
5. Clique no ícone de "play" para enviar a campanha

#### Verificar logs de email

Como o envio real de emails está desabilitado por padrão, você pode ver os emails no log do backend:

```bash
docker-compose logs backend | grep "EMAIL LOG"
```

### 6. Parar os serviços

```bash
docker-compose down
```

Para remover também os volumes (dados do banco):

```bash
docker-compose down -v
```

## Testes de API via curl

### Criar contato

```bash
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "tags": ["test"]}'
```

### Listar contatos

```bash
curl http://localhost:8080/api/contacts
```

### Criar campanha

```bash
curl -X POST http://localhost:8080/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Campaign",
    "subject": "Test Subject",
    "content": "<h1>Hello {{name}}</h1>",
    "targetTags": ["test"]
  }'
```

### Ver estatísticas

```bash
curl http://localhost:8080/api/analytics/dashboard
```

## Configurar envio real de emails

Para enviar emails reais, edite o `docker-compose.yml`:

```yaml
backend:
  environment:
    - MAIL_ENABLED=true
    - MAIL_FROM=seu@email.com
    # Para SMTP genérico
    - SMTP_HOST=smtp.gmail.com
    - SMTP_PORT=587
    - SMTP_USER=seu@gmail.com
    - SMTP_PASS=sua-senha-app
    - SMTP_AUTH=true
    - SMTP_TLS=true
```

Reinicie os serviços:

```bash
docker-compose down
docker-compose up -d --build
```

## Solução de problemas

### Porta já em uso

Se as portas 3000, 8080, 5432 ou 6379 estiverem ocupadas:

```bash
# Verifique o que está usando a porta
lsof -i :3000

# Ou mude as portas no docker-compose.yml
```

### Containers não iniciam

```bash
# Verifique o status
docker-compose ps

# Verifique os logs
docker-compose logs

# Reconstrua do zero
docker-compose down -v
docker-compose up -d --build
```

### Erro de permissão

No Linux/Mac, pode ser necessário:

```bash
sudo chown -R $USER:$USER .
```

## Suporte

Abra uma issue no GitHub se encontrar problemas:
https://github.com/targiinou/mailforge/issues
