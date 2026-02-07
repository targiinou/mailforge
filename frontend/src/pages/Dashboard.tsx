import React, { useEffect, useState } from 'react';
import { Send, Users, Eye, MousePointer, TrendingUp, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { analyticsApi } from '../api';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalSent: 0,
    totalOpened: 0,
    totalClicked: 0,
    totalBounced: 0,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await analyticsApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const chartData = [
    { name: 'Enviados', value: stats.totalSent, color: '#3b82f6' },
    { name: 'Abertos', value: stats.totalOpened, color: '#10b981' },
    { name: 'Clicks', value: stats.totalClicked, color: '#8b5cf6' },
    { name: 'Bounces', value: stats.totalBounced, color: '#ef4444' },
  ];

  const statCards = [
    { label: 'Emails Enviados', value: stats.totalSent, icon: Send, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Taxa de Abertura', value: `${stats.openRate}%`, icon: Eye, color: 'bg-green-500', trend: '+5%' },
    { label: 'Taxa de Clique', value: `${stats.clickRate}%`, icon: MousePointer, color: 'bg-purple-500', trend: '+8%' },
    { label: 'Contatos', value: '0', icon: Users, color: 'bg-orange-500', trend: '+23%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Dashboard</h2>
        <p className="text-gray-600 dark:text-dark-muted">Visão geral das suas campanhas de email</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-muted">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text mt-1">{card.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">{card.trend}</span>
                  <span className="text-sm text-gray-400">vs mês passado</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
            Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }} 
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
            Taxas
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Jan', openRate: 45, clickRate: 12 },
                { name: 'Fev', openRate: 52, clickRate: 15 },
                { name: 'Mar', openRate: 48, clickRate: 14 },
                { name: 'Abr', openRate: 61, clickRate: 18 },
                { name: 'Mai', openRate: 55, clickRate: 16 },
                { name: 'Jun', openRate: stats.openRate, clickRate: stats.clickRate },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }} 
                />
                <Line type="monotone" dataKey="openRate" stroke="#10b981" strokeWidth={2} name="Abertura %" />
                <Line type="monotone" dataKey="clickRate" stroke="#8b5cf6" strokeWidth={2} name="Cliques %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Atividade Recente</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-dark-border">
          {[
            { action: 'Campanha enviada', item: 'Newsletter Janeiro', time: '2 horas atrás', icon: Mail },
            { action: 'Novo contato', item: 'joao@exemplo.com', time: '5 horas atrás', icon: Users },
            { action: 'Template criado', item: 'Promoção de Verão', time: '1 dia atrás', icon: Send },
          ].map((activity, idx) => (
            <div key={idx} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                <activity.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-dark-text">{activity.action}</p>
                <p className="text-sm text-gray-500 dark:text-dark-muted">{activity.item}</p>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
