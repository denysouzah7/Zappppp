
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { baserowApi } from '../services/baserowService';
import { CONFIG } from '../constants';
import { Group, GroupStatus } from '../types';
import SEO from '../components/SEO';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }
    const fetchUserGroups = async () => {
      try {
        const response = await baserowApi.getRows<Group>(CONFIG.TABLE_GROUPS_ID, `&filter__field_${CONFIG.TABLE_GROUPS_ID}_user_id__equal=${user.id}`);
        setGroups(response.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserGroups();
  }, [user, navigate]);

  const handleBoost = async (group: Group) => {
    const confirm = window.confirm('Deseja impulsionar este grupo por 1 hora? Ele aparecerá no topo da página inicial.');
    if (!confirm) return;

    try {
      const now = new Date();
      const boostUntil = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      await baserowApi.updateRow(CONFIG.TABLE_GROUPS_ID, group.id, {
        impulsionado: true,
        impulsionado_ate: boostUntil
      });
      alert('Grupo impulsionado com sucesso!');
      // Refresh list
      const response = await baserowApi.getRows<Group>(CONFIG.TABLE_GROUPS_ID, `&filter__field_${CONFIG.TABLE_GROUPS_ID}_user_id__equal=${user!.id}`);
      setGroups(response.results);
    } catch (err) {
      console.error(err);
      alert('Erro ao impulsionar grupo.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SEO title="Painel do Usuário" description="Gerencie seus grupos cadastrados." />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Meus Grupos</h1>
          <p className="text-gray-500">Bem-vindo, {user?.nome}. Aqui você gerencia seus links.</p>
        </div>
        <Link 
          to="/novo-grupo"
          className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all text-center"
        >
          + Cadastrar Novo Grupo
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Você ainda não tem grupos</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Cadastre seu primeiro grupo de WhatsApp agora e comece a receber novos membros.</p>
          <Link to="/novo-grupo" className="text-green-600 font-bold hover:underline">Divulgar primeiro grupo</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map(group => (
            <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="aspect-video relative">
                <img src={group.imagem_url || 'https://picsum.photos/400/225'} alt={group.nome} className="w-full h-full object-cover" />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${group.status === GroupStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {group.status === GroupStatus.APPROVED ? 'Aprovado' : 'Pendente'}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-1">{group.nome}</h3>
                <p className="text-gray-500 text-sm mb-4">{group.categoria}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <span className="block text-xl font-black text-gray-900">{group.cliques}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Cliques</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <span className="block text-xl font-black text-gray-900">{group.denuncias || 0}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Denúncias</span>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  <button 
                    onClick={() => handleBoost(group)}
                    disabled={group.impulsionado && group.impulsionado_ate && new Date(group.impulsionado_ate) > new Date()}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>
                    {group.impulsionado && group.impulsionado_ate && new Date(group.impulsionado_ate) > new Date() ? 'Impulsionado' : 'Impulsionar (1h)'}
                  </button>
                  <Link 
                    to={`/editar-grupo/${group.id}`}
                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all text-center"
                  >
                    Editar Grupo
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
