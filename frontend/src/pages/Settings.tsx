import React from 'react';
import { Mail, Database, Server, Shield, Info } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Configurações</h2>
        <p className="text-gray-600 dark:text-dark-muted">
          Configure as opções da aplicação
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SMTP Configuration */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                Configuração SMTP
              </h3>
              <p className="text-sm text-gray-500 dark:text-dark-muted">
                Configure seu provedor de email
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Provedor</label>
              <select className="input">
                <option value="console">Console (Logs apenas)</option>
                <option value="resend">Resend</option>
                <option value="sendgrid">SendGrid</option>
                <option value="ses">AWS SES</option>
                <option value="smtp">SMTP Genérico</option>
              </select>
            </div>

            <div>
              <label className="label">Email de Envio</label>
              <input
                type="email"
                className="input"
                placeholder="noreply@suaempresa.com"
              />
            </div>

            <div>
              <label className="label">API Key / Senha</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button className="btn-primary w-full">
              Salvar Configurações
            </button>
          </div>
        </div>

        {/* Database Info */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                Banco de Dados
              </h3>
              <p className="text-sm text-gray-500 dark:text-dark-muted">
                Informações da conexão
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Tipo', value: 'PostgreSQL 15' },
              { label: 'Host', value: 'postgres (Docker)' },
              { label: 'Database', value: 'mailforge' },
              { label: 'Status', value: 'Conectado', color: 'text-green-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-border last:border-0">
                <span className="text-gray-600 dark:text-dark-muted">{item.label}</span>
                <span className={`font-medium text-gray-900 dark:text-dark-text ${item.color || ''}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cache / Redis */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                Cache (Redis)
              </h3>
              <p className="text-sm text-gray-500 dark:text-dark-muted">
                Configuração do cache
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Host', value: 'redis:6379' },
              { label: 'Status', value: 'Conectado', color: 'text-green-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-border last:border-0">
                <span className="text-gray-600 dark:text-dark-muted">{item.label}</span>
                <span className={`font-medium text-gray-900 dark:text-dark-text ${item.color || ''}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                Sobre
              </h3>
              <p className="text-sm text-gray-500 dark:text-dark-muted">
                Informações da aplicação
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Versão', value: '1.0.0' },
              { label: 'Backend', value: 'Spring Boot 3.2' },
              { label: 'Frontend', value: 'React 18 + TypeScript' },
              { label: 'Licença', value: 'MIT' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-border last:border-0">
                <span className="text-gray-600 dark:text-dark-muted">{item.label}</span>
                <span className="font-medium text-gray-900 dark:text-dark-text">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">
              Nota de Segurança
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
              As configurações de SMTP são armazenadas em variáveis de ambiente. 
              Certifique-se de configurar corretamente no seu ambiente de produção 
              e nunca comite credenciais no repositório.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
