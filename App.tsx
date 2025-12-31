
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import GroupDetail from './pages/GroupDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddEditGroup from './pages/AddEditGroup';
import AdminPanel from './pages/AdminPanel';
import { CONFIG } from './constants';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? 'bg-slate-900/80 backdrop-blur-md border-b border-white/5' : 'bg-white/90 backdrop-blur-md border-b border-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
             <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/></svg>
          </div>
          <span className={`text-xl font-black tracking-tighter ${isHome ? 'text-white' : 'text-slate-900'}`}>
            ZAP<span className="text-emerald-500">GROUPS</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-4 md:gap-8">
          {user ? (
            <>
              <Link to="/dashboard" className={`text-sm font-bold ${isHome ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Meu Painel</Link>
              <button 
                onClick={logout}
                className={`text-sm font-bold ${isHome ? 'text-emerald-400' : 'text-emerald-600'} hover:opacity-80 transition-opacity`}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`text-sm font-bold ${isHome ? 'text-slate-300' : 'text-slate-600'}`}>Entrar</Link>
              <Link 
                to="/register" 
                className="text-sm font-black px-5 py-2.5 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                Começar Grátis
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-500 py-16 px-4 border-t border-white/5">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
             <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/></svg>
          </div>
          <span className="text-lg font-black text-white tracking-tighter">ZAPGROUPS</span>
        </div>
        <p className="text-sm leading-relaxed max-w-sm">
          A plataforma número #1 para encontrar e divulgar comunidades de WhatsApp. Otimizada para SEO e projetada para máxima conversão.
        </p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">Links Rápidos</h4>
        <ul className="space-y-4 text-sm">
          <li><Link to="/" className="hover:text-emerald-400 transition-colors">Página Inicial</Link></li>
          <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Login</Link></li>
          <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Criar Conta</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-widest">Legal</h4>
        <ul className="space-y-4 text-sm">
          <li><a href="#" className="hover:text-emerald-400 transition-colors">Termos de Uso</a></li>
          <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacidade</a></li>
          <li><a href="#" className="hover:text-emerald-400 transition-colors">Contato</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
      <p>&copy; {new Date().getFullYear()} ZapGroups Pro. Made with ❤️ for communities.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-white">Twitter</a>
        <a href="#" className="hover:text-white">Instagram</a>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen pt-16 md:pt-20">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/grupo/:slug" element={<GroupDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/novo-grupo" element={<AddEditGroup />} />
              <Route path="/editar-grupo/:id" element={<AddEditGroup />} />
              <Route path={`/admin-${CONFIG.ADMIN_TOKEN}`} element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
