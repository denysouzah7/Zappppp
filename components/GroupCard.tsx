
import React from 'react';
import { Link } from 'react-router-dom';
import { Group } from '../types';

interface GroupCardProps {
  group: Group;
  boosted?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, boosted }) => {
  return (
    <div className={`relative bg-white rounded-xl shadow-sm overflow-hidden border transition-all hover:shadow-md ${boosted ? 'border-yellow-400 ring-2 ring-yellow-400 ring-opacity-20' : 'border-gray-200'}`}>
      {boosted && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm z-10 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>
          IMPULSIONADO
        </div>
      )}
      <div className="aspect-video w-full bg-gray-100 overflow-hidden">
        <img 
          src={group.imagem_url || 'https://picsum.photos/400/225'} 
          alt={group.nome} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">{group.categoria}</span>
          <span className="text-xs text-gray-500 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            {group.cliques}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{group.nome}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
          {group.descricao}
        </p>
        <Link 
          to={`/grupo/${group.id}-${group.nome.toLowerCase().replace(/\s+/g, '-')}`}
          className="block w-full text-center bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-black transition-colors"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
};

export default GroupCard;
