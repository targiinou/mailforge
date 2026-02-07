import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Mail, FileText, Settings, Send } from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/contacts', icon: Users, label: 'Contatos' },
  { path: '/campaigns', icon: Mail, label: 'Campanhas' },
  { path: '/templates', icon: FileText, label: 'Templates' },
  { path: '/settings', icon: Settings, label: 'Configurações' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text">MailForge</h1>
            <p className="text-xs text-gray-500 dark:text-dark-muted">Email Campaigns</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-dark-border">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 text-white">
          <p className="text-sm font-medium">Plano Free</p>
          <p className="text-xs text-primary-100 mt-1">100 emails/mês</p>
          <button className="mt-3 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}
