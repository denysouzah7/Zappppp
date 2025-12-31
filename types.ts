
export enum UserType {
  USER = 'user',
  ADMIN = 'admin'
}

export enum GroupStatus {
  PENDING = 'pending',
  APPROVED = 'approved'
}

export interface User {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  tipo: UserType;
  created_at: string;
}

export interface Group {
  id: number;
  user_id: number; // Linked user ID
  nome: string;
  categoria: string;
  link_whatsapp: string;
  descricao: string;
  regras: string;
  imagem_url: string; // Base64 or direct link
  status: GroupStatus;
  cliques: number;
  impulsionado: boolean;
  impulsionado_ate: string | null;
  denuncias: number;
  created_at: string;
}

export interface Denuncia {
  id: number;
  group_id: number;
  motivo: string;
  created_at: string;
}

export interface BaserowRow<T> {
  id: number;
  order: string;
  [key: string]: any;
}

export interface BaserowListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
