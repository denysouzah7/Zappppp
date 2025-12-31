
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { baserowApi } from '../services/baserowService';
import { CONFIG } from '../constants';
import { Group, Denuncia } from '../types';
import SEO from '../components/SEO';

const GroupDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const groupId = slug ? parseInt(slug.split('-')[0]) : 0;

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await baserowApi.getRow<Group>(CONFIG.TABLE_GROUPS_ID, groupId);
        setGroup(data);
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    if (groupId) fetchGroup();
  }, [groupId, navigate]);

  const handleJoin = async () => {
    if (!group) return;
    try {
      // Increment clicks
      await baserowApi.updateRow(CONFIG.TABLE_GROUPS_ID, group.id, { cliques: (group.cliques || 0) + 1 });
      window.open(group.link_whatsapp, '_blank');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async () => {
    if (!group || !reportReason) return;
    try {
      await baserowApi.createRow<Denuncia>(CONFIG.TABLE_DENUNCIAS_ID, {
        group_id: group.id,
        motivo: reportReason,
        created_at: new Date().toISOString()
      });
      // Increment reports counter on group
      await baserowApi.updateRow(CONFIG.TABLE_GROUPS_ID, group.id, { denuncias: (group.denuncias || 0) + 1 });
      alert('Denúncia enviada com sucesso. Nossos administradores irão analisar.');
      setReporting(false);
      setReportReason('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20 min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );

  if (!group) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SEO 
        title={group.nome} 
        description={group.descricao.substring(0, 160)} 
        image={group.imagem_url} 
      />

      <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Image */}
        <div className="aspect-video md:aspect-[21/9] w-full bg-gray-100">
          <img src={group.imagem_url || 'https://picsum.photos/1200/600'} alt={group.nome} className="w-full h-full object-cover" />
        </div>

        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                {group.categoria}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">{group.nome}</h1>
              <p className="text-gray-500 text-sm mt-1">Cadastrado em {new Date(group.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <span className="font-bold text-gray-700">{group.cliques} visualizações</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-1.5 h-6 bg-green-500 rounded-full mr-3"></span>
                  Descrição do Grupo
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{group.descricao}</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center text-red-600">
                  <span className="w-1.5 h-6 bg-red-500 rounded-full mr-3"></span>
                  Regras do Grupo
                </h2>
                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                  <p className="text-red-900 leading-relaxed whitespace-pre-wrap">{group.regras}</p>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handleJoin}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center text-lg"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.516.893 3.004 1.399 4.946 1.4 5.457 0 9.897-4.442 9.9-9.9.001-2.646-1.033-5.132-2.908-7.01-1.875-1.878-4.361-2.912-7.01-2.912-5.459 0-9.902 4.443-9.904 9.902-.001 2.036.556 3.541 1.426 5.05l-.95 3.473 3.546-.903zm10.513-7.512c-.289-.144-1.711-.845-1.975-.941-.264-.096-.456-.144-.648.144-.192.288-.744.941-.912 1.133-.168.192-.336.216-.624.072-.288-.144-1.217-.449-2.318-1.431-.857-.764-1.435-1.708-1.603-1.996-.168-.288-.018-.444.126-.587.13-.129.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.234-.569-.472-.491-.648-.499l-.552-.008c-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.399 0 1.416 1.032 2.784 1.176 2.976.144.192 2.031 3.102 4.921 4.35.687.297 1.224.474 1.643.607.69.219 1.319.189 1.815.114.553-.083 1.711-.699 1.951-1.374.24-.675.24-1.253.168-1.374-.072-.12-.264-.192-.552-.336z"/></svg>
                ENTRAR NO GRUPO
              </button>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                <p className="text-gray-500 text-sm mb-4 italic">Algum problema com este grupo? Link quebrado ou conteúdo ofensivo?</p>
                <button 
                  onClick={() => setReporting(true)}
                  className="text-red-500 font-semibold hover:underline text-sm uppercase tracking-wider"
                >
                  DENUNCIAR GRUPO
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Report Modal */}
      {reporting && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Denunciar Grupo</h3>
            <p className="text-gray-600 mb-6">Por favor, descreva o motivo da denúncia para que possamos analisar.</p>
            <textarea 
              className="w-full border rounded-xl p-4 h-32 mb-6 focus:ring-2 focus:ring-red-500 focus:outline-none bg-gray-50"
              placeholder="Ex: Link quebrado, pornografia, spam..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setReporting(false)}
                className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleReport}
                disabled={!reportReason}
                className="flex-1 py-3 font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Enviar Denúncia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
