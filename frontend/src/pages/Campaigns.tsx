import React, { useEffect, useState } from 'react';
import { Plus, Send, Calendar, Users, Eye, Edit2, Trash2, Play, Pause } from 'lucide-react';
import { campaignsApi, contactsApi } from '../api';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';

export function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    contactIds: [],
    targetTags: [],
    scheduledAt: '',
  });

  useEffect(() => {
    loadCampaigns();
    loadContacts();
    loadTags();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignsApi.getAll();
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const response = await contactsApi.getAll();
      setContacts(response.data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const loadTags = async () => {
    try {
      const response = await contactsApi.getTags();
      setTags(response.data);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCampaign) {
        await campaignsApi.update(editingCampaign.id, formData);
      } else {
        await campaignsApi.create(formData);
      }
      setIsModalOpen(false);
      setEditingCampaign(null);
      resetForm();
      loadCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Erro ao salvar campanha');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta campanha?')) return;
    try {
      await campaignsApi.delete(id);
      loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleSend = async (id: number) => {
    if (!confirm('Deseja enviar esta campanha agora?')) return;
    try {
      await campaignsApi.send(id, false);
      alert('Campanha enviada com sucesso!');
      loadCampaigns();
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Erro ao enviar campanha');
    }
  };

  const handleEdit = (campaign: any) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      contactIds: [],
      targetTags: [],
      scheduledAt: '',
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      content: '',
      contactIds: [],
      targetTags: [],
      scheduledAt: '',
    });
  };

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    SCHEDULED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    SENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    SENT: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };

  const statusLabels: Record<string, string> = {
    DRAFT: 'Rascunho',
    SCHEDULED: 'Agendada',
    SENDING: 'Enviando',
    SENT: 'Enviada',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Campanhas</h2>
          <p className="text-gray-600 dark:text-dark-muted">
            Crie e gerencie suas campanhas de email
          </p>
        </div>
        <Button onClick={() => {
          setEditingCampaign(null);
          resetForm();
          setIsModalOpen(true);
        }}>
          <Plus className="w-4 h-4" />
          <span>Nova Campanha</span>
        </Button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign: any) => (
          <div key={campaign.id} className="card p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                  {statusLabels[campaign.status]}
                </span>
              </div>
              <div className="flex gap-1">
                {campaign.status === 'DRAFT' && (
                  <button
                    onClick={() => handleSend(campaign.id)}
                    className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="Enviar"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleEdit(campaign)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
              {campaign.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-dark-muted line-clamp-2">
              {campaign.subject}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-dark-muted">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{campaign.contactCount} contatos</span>
              </div>
              {campaign.scheduledAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(campaign.scheduledAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {campaign.status === 'SENT' && (
              <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-dark-muted">Enviado em:</span>
                  <span className="text-gray-900 dark:text-dark-text">
                    {campaign.sentAt && new Date(campaign.sentAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nome da Campanha</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
              placeholder="Newsletter Janeiro"
            />
          </div>

          <div>
            <label className="label">Assunto do Email</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="input"
              required
              placeholder="Confira as novidades deste mês!"
            />
          </div>

          <div>
            <label className="label">Conteúdo (HTML suportado)</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input h-40 font-mono text-sm"
              required
              placeholder="<h1>Olá {{name}}!</h1><p>Seu conteúdo aqui...</p>"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use {'{{name}}'} e {'{{email}}'} para personalização
            </p>
          </div>

          <div>
            <label className="label">Segmentação por Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <label
                  key={tag}
                  className={`inline-flex items-center px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                    formData.targetTags.includes(tag)
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-dark-bg dark:text-dark-muted hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.targetTags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, targetTags: [...formData.targetTags, tag] });
                      } else {
                        setFormData({ 
                          ...formData, 
                          targetTags: formData.targetTags.filter((t) => t !== tag) 
                        });
                      }
                    }}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Agendar Envio (opcional)</label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              className="input"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingCampaign ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
