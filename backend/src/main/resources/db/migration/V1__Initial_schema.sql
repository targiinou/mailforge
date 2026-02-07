-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_tags table
CREATE TABLE IF NOT EXISTS contact_tags (
    contact_id BIGINT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL,
    PRIMARY KEY (contact_id, tag)
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create campaign_contacts table
CREATE TABLE IF NOT EXISTS campaign_contacts (
    campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    contact_id BIGINT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    PRIMARY KEY (campaign_id, contact_id)
);

-- Create campaign_tags table
CREATE TABLE IF NOT EXISTS campaign_tags (
    campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL,
    PRIMARY KEY (campaign_id, tag)
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    campaign_id BIGINT REFERENCES campaigns(id) ON DELETE SET NULL,
    contact_id BIGINT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    subject VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    tracking_id VARCHAR(255) UNIQUE,
    sent_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign ON email_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_tracking ON email_logs(tracking_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- Insert sample templates
INSERT INTO templates (name, description, subject, content) VALUES
('Welcome Email', 'Template for welcome emails', 'Bem-vindo {{name}}!', 
'<html><body>
<h1>Olá {{name}}!</h1>
<p>Bem-vindo à nossa plataforma. Estamos felizes em tê-lo conosco.</p>
<p>Seu email é: {{email}}</p>
</body></html>'
) ON CONFLICT DO NOTHING;

INSERT INTO templates (name, description, subject, content) VALUES
('Newsletter', 'Template for newsletters', 'Novidades da Semana',
'<html><body>
<h1>Olá {{name}}!</h1>
<p>Confira as novidades desta semana.</p>
<p>Acesse nosso site para mais informações.</p>
</body></html>'
) ON CONFLICT DO NOTHING;
