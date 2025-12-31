
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { baserowApi } from '../services/baserowService';
import { CONFIG } from '../constants';
import { Group, GroupStatus, Denuncia } from '../types';
import SEO from '../components/SEO';

const AdminPanel: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'groups' | 'reports'>('groups');

  useEffect(() => {
    if (token !== CONFIG.ADMIN_TOKEN) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const groupsRes = await baserowApi.getRows<Group>(CONFIG.TABLE_GROUPS_ID);
        const reportsRes = await baserowApi.getRows<Denuncia>(CONFIG.TABLE_DENUNCIAS_ID);
        setGroups(groupsRes.results);
        setDenuncias(reportsRes.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, navigate]);

  const toggleStatus = async (group: Group) => {
    const newStatus = group.status === GroupStatus.APPROVED ? GroupStatus.PENDING : GroupStatus.APPROVED;
    try {
      await baserowApi.updateRow(CONFIG.TABLE_GROUPS_ID, group.id, { status: newStatus });
      setGroups(groups.map(g => g.id === group.id ? { ...g, status: newStatus } : g));
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  const deleteGroup = async (id: number) => {
    if (!window.confirm('Tem certeza?')) return;
    try {
      await baserowApi.deleteRow(CONFIG.TABLE_GROUPS_ID, id);
      setGroups(groups.filter(g => g.id !== id));
    } catch (err) {
      alert('Erro ao deletar');
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando painel secreto...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SEO title="Admin" description="Painel de administração exclusivo." />
      
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-black text-gray-900 uppercase">Admin Console</h1>
        <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
          <button 
            onClick={() => setActiveTab('groups')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'groups' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          >
            Grupos ({groups.length})
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'reports' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'}`}
          >
            Denúncias ({denuncias.length})
          </button>
        </div>
      </div>

      {activeTab === 'groups' ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-sm border overflow-hidden">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Grupo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Stats</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groups.map(g => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{g.nome}</div>
                    <div className="text-xs text-gray-500">{g.categoria}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(g)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${g.status === GroupStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                    >
                      {g.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-gray-600">{g.cliques} cliques</div>
                    <div className="text-xs text-red-500">{g.denuncias || 0} denúncias</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => deleteGroup(g.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-6">
          {denuncias.length === 0 ? <p className="text-center text-gray-500 py-20">Nenhuma denúncia no momento.</p> : denuncias.map(d => (
            <div key={d.id} className="bg-white p-6 rounded-2xl border-l-4 border-red-500 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-gray-400">ID Grupo: {d.group_id}</span>
                <span className="text-xs text-gray-400">{new Date(d.created_at).toLocaleString()}</span>
              </div>
              <p className="text-gray-800 font-medium italic">"{d.motivo}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
