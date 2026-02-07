import React, { useState } from 'react';
import { Copy, Check, FileText, Mail, Sparkles } from 'lucide-react';

const templates = [
  {
    id: 1,
    name: 'Welcome Email',
    description: 'Template de boas-vindas para novos contatos',
    subject: 'Bem-vindo {{name}}!',
    content: `<h1>Olá {{name}}!</h1>
<p>Bem-vindo à nossa plataforma. Estamos felizes em tê-lo conosco.</p>
<p>Seu email cadastrado é: {{email}}</p>
<p>Se precisar de ajuda, não hesite em nos contatar.</p>`,
  },
  {
    id: 2,
    name: 'Newsletter',
    description: 'Template para newsletters mensais',
    subject: 'Novidades da Semana',
    content: `<h2>Olá {{name}}!</h2>
<p>Confira as novidades desta semana:</p>
<ul>
  <li>Nova funcionalidade X</li>
  <li>Promoção especial Y</li>
  <li>Evento Z</li>
</ul>
<p>Acesse nosso site para mais informações.</p>`,
  },
  {
    id: 3,
    name: 'Promoção',
    description: 'Template para campanhas promocionais',
    subject: 'Oferta especial para você, {{name}}!',
    content: `<h1>🎉 Oferta Especial!</h1>
<p>Olá {{name}},</p>
<p>Temos uma oferta exclusiva para você!</p>
<div style="background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center;">
  <h2>50% OFF</h2>
  <p>Use o código: PROMO2024</p>
</div>
<p>Aproveite agora mesmo!</p>`,
  },
  {
    id: 4,
    name: 'Lembrete',
    description: 'Template para lembretes e notificações',
    subject: 'Lembrete importante',
    content: `<h2>Olá {{name}},</h2>
<p>Este é um lembrete sobre o evento/produto/serviço X.</p>
<p>Data: XX/XX/XXXX</p>
<p>Para mais informações, acesse sua conta.</p>`,
  },
];

export function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Templates</h2>
        <p className="text-gray-600 dark:text-dark-muted">
          Templates pré-prontos para suas campanhas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            Disponíveis
          </h3>
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedTemplate.id === template.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hover:border-primary-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedTemplate.id === template.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-dark-muted'
                }`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-dark-text">
                    {template.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-dark-muted">
                    {template.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 card">
          <div className="p-6 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                {selectedTemplate.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-dark-muted">
                {selectedTemplate.description}
              </p>
            </div>
            <button
              onClick={() => handleCopy(selectedTemplate.content)}
              className="btn-secondary"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar HTML'}</span>
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="label">Assunto</label>
              <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-lg font-mono text-sm text-gray-700 dark:text-dark-muted">
                {selectedTemplate.subject}
              </div>
            </div>

            <div>
              <label className="label">Pré-visualização</label>
              <div 
                className="p-6 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
              />
            </div>

            <div>
              <label className="label">Código HTML</label>
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm">
                <code>{selectedTemplate.content.trim()}</code>
              </pre>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    Dica de Personalização
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Use {'{{name}}'} para inserir o nome do contato e {'{{email}}'} para inserir o email. 
                    Essas variáveis serão substituídas automaticamente ao enviar a campanha.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
