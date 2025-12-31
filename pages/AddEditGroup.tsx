
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { baserowApi } from '../services/baserowService';
import { CONFIG, CATEGORIES } from '../constants';
import { Group, GroupStatus } from '../types';
import SEO from '../components/SEO';

const AddEditGroup: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nome: '',
    categoria: '',
    link_whatsapp: '',
    descricao: '',
    regras: '',
    imagem_url: ''
  });

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }
    if (id) {
      const fetchGroup = async () => {
        try {
          const data = await baserowApi.getRow<Group>(CONFIG.TABLE_GROUPS_ID, parseInt(id));
          if (data.user_id !== user.id && user.tipo !== 'admin') {
            navigate('/dashboard');
            return;
          }
          setForm({
            nome: data.nome,
            categoria: data.categoria,
            link_whatsapp: data.link_whatsapp,
            descricao: data.descricao,
            regras: data.regras,
            imagem_url: data.imagem_url
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchGroup();
    }
  }, [id, user, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imagem_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    if (!form.nome || form.nome.length < 3) return 'O nome do grupo deve ter pelo menos 3 caracteres.';
    if (!CATEGORIES.includes(form.categoria)) return 'Selecione uma categoria válida.';
    if (!form.link_whatsapp.includes('chat.whatsapp.com')) return 'O link deve ser um convite de grupo do WhatsApp válido.';
    if (form.descricao.length < 50) return 'A descrição deve ter no mínimo 50 caracteres.';
    if (form.regras.length < 50) return 'As regras devem ter no mínimo 50 caracteres.';
    if (!form.imagem_url) return 'A imagem do grupo é obrigatória.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (id) {
        await baserowApi.updateRow(CONFIG.TABLE_GROUPS_ID, parseInt(id), {
          ...form,
          status: GroupStatus.PENDING // Re-verify on edit
        });
        alert('Grupo atualizado! Aguarde nova aprovação.');
      } else {
        await baserowApi.createRow(CONFIG.TABLE_GROUPS_ID, {
          ...form,
          user_id: user?.id,
          status: GroupStatus.PENDING,
          cliques: 0,
          impulsionado: false,
          impulsionado_ate: null,
          denuncias: 0,
          created_at: new Date().toISOString()
        });
        alert('Grupo cadastrado com sucesso! Ele aparecerá no site após aprovação.');
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Falha ao salvar o grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SEO title={id ? 'Editar Grupo' : 'Novo Grupo'} description="Cadastre seu grupo de WhatsApp no diretório." />
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-gray-900 mb-2">{id ? 'Editar Grupo' : 'Cadastrar Novo Grupo'}</h1>
        <p className="text-gray-500">Preencha os dados abaixo com atenção. Regras mínimas de caracteres são obrigatórias.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-sm font-bold border border-red-100 flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Grupo</label>
              <input 
                type="text" 
                placeholder="Ex: Amigos da Cerveja"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              >
                <option value="">Selecione...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Link do WhatsApp</label>
            <input 
              type="url" 
              placeholder="https://chat.whatsapp.com/..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={form.link_whatsapp}
              onChange={(e) => setForm({ ...form, link_whatsapp: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Descrição Completa (Min 50 chars)</label>
            <textarea 
              rows={4}
              placeholder="Fale sobre o objetivo do seu grupo..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
            <p className="text-right text-xs text-gray-400 mt-1">{form.descricao.length}/50</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Regras do Grupo (Min 50 chars)</label>
            <textarea 
              rows={4}
              placeholder="O que pode e o que não pode no grupo..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={form.regras}
              onChange={(e) => setForm({ ...form, regras: e.target.value })}
            />
            <p className="text-right text-xs text-gray-400 mt-1">{form.regras.length}/50</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Imagem de Capa</label>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-48 aspect-video md:aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center relative group">
                {form.imagem_url ? (
                  <img src={form.imagem_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-gray-200" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/></svg>
                )}
              </div>
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" 
                  id="image-upload" 
                />
                <label 
                  htmlFor="image-upload" 
                  className="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl font-bold cursor-pointer hover:bg-black transition-all"
                >
                  {form.imagem_url ? 'Trocar Imagem' : 'Selecionar Imagem'}
                </label>
                <p className="text-xs text-gray-400 mt-2 italic">Formatos aceitos: JPG, PNG. Recomendado 1200x600px.</p>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-green-100 transition-all text-xl disabled:opacity-50"
          >
            {loading ? 'Salvando...' : (id ? 'Atualizar Grupo' : 'Publicar Grupo Agora')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditGroup;
