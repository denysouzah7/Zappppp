
import { CONFIG } from '../constants';
import { BaserowListResponse } from '../types';

const API_BASE = 'https://api.baserow.io/api/database/rows/table';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Token ${CONFIG.BASEROW_API_KEY}`
};

export const baserowApi = {
  async getRows<T>(tableId: string, params: string = ''): Promise<BaserowListResponse<T>> {
    const response = await fetch(`${API_BASE}/${tableId}/?user_field_names=true${params}`, { headers });
    if (!response.ok) throw new Error('Falha ao buscar dados no Baserow');
    return response.json();
  },

  async getRow<T>(tableId: string, rowId: number): Promise<T> {
    const response = await fetch(`${API_BASE}/${tableId}/${rowId}/?user_field_names=true`, { headers });
    if (!response.ok) throw new Error('Falha ao buscar linha no Baserow');
    return response.json();
  },

  async createRow<T>(tableId: string, data: Partial<T>): Promise<T> {
    const response = await fetch(`${API_BASE}/${tableId}/?user_field_names=true`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Falha ao criar linha');
    }
    return response.json();
  },

  async updateRow<T>(tableId: string, rowId: number, data: Partial<T>): Promise<T> {
    const response = await fetch(`${API_BASE}/${tableId}/${rowId}/?user_field_names=true`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Falha ao atualizar linha');
    return response.json();
  },

  async deleteRow(tableId: string, rowId: number): Promise<void> {
    const response = await fetch(`${API_BASE}/${tableId}/${rowId}/`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Falha ao deletar linha');
  }
};
