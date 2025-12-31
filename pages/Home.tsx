
import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/apiService';
import { CATEGORIES } from '../constants';
import { Group } from '../types';
import GroupCard from '../components/GroupCard';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await apiService.groups.list('&status=approved');
        setGroups(response.results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const filteredGroups = useMemo(() => {
    let list = groups.filter(g => 
      g.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || g.categoria === selectedCategory)
    );

    const now = new Date();
    const boosted = list.filter(g => g.impulsionado && g.impulsionado_ate && new Date(g.impulsionado_ate) > now)
                        .sort(() => Math.random() - 0.5);
    
    const normal = list.filter(g => !g.impulsionado || !g.impulsionado_ate || new Date(g.impulsionado_ate) <= now)
                       .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return { boosted, normal };
  }, [groups, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Início" 
        description="Encontre os melhores grupos de WhatsApp para participar. Divulgue seu grupo gratuitamente!" 
      />

      {/* Hero Section - Dark Refresh */}
      <section className="relative bg-slate-900 overflow-hidden pt-20 pb-16 md:pt-32 md:pb-28">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Descubra as Melhores <span className="text-emerald-400">Comunidades</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            O diretório mais completo de grupos do WhatsApp. Encontre seu nicho, faça amizades e impulsione seu grupo.
          </p>
          
          <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
               <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
               <input 
                type="text" 
                placeholder="Buscar por nome ou tema..." 
                className="w-full pl-12 pr-4 py-4 bg-transparent text-white focus:outline-none placeholder:text-slate-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-64 border-t md:border-t-0 md:border-l border-white/10 px-2 flex items-center">
              <select 
                className="w-full bg-transparent text-slate-300 py-4 focus:outline-none cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All" className="bg-slate-800">Todas Categorias</option>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Boosted Section */}
            {filteredGroups.boosted.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center">
                    <span className="w-2 h-8 bg-emerald-500 rounded-full mr-4"></span>
                    Em Destaque
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredGroups.boosted.map(group => (
                    <GroupCard key={group.id} group={group} boosted />
                  ))}
                </div>
              </section>
            )}

            {/* Normal Section */}
            <section>
              <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center">
                <span className="w-2 h-8 bg-slate-300 rounded-full mr-4"></span>
                Recentemente Adicionados
              </h2>
              {filteredGroups.normal.length === 0 && filteredGroups.boosted.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 text-lg">Nenhum grupo encontrado com os filtros selecionados.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredGroups.normal.map(group => (
                    <GroupCard key={group.id} group={group} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
