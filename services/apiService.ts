
import { CONFIG } from '../constants';

export const apiService = {
  async request(action: string, method: string = 'GET', data: any = null) {
    const url = `${CONFIG.API_URL}?action=${action}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || 'Erro na requisição');
    }

    return result;
  },

  // Helpers específicos
  groups: {
    list: (params: string = '') => apiService.request(`groups_list${params}`),
    get: (id: number) => apiService.request(`groups_get&id=${id}`),
    create: (data: any) => apiService.request('groups_create', 'POST', data),
    update: (id: number, data: any) => apiService.request(`groups_update&id=${id}`, 'POST', data),
    delete: (id: number) => apiService.request(`groups_delete&id=${id}`, 'DELETE'),
    incrementClick: (id: number) => apiService.request(`groups_click&id=${id}`, 'POST'),
  },
  auth: {
    login: (credentials: any) => apiService.request('login', 'POST', credentials),
    register: (userData: any) => apiService.request('register', 'POST', userData),
  },
  reports: {
    create: (data: any) => apiService.request('reports_create', 'POST', data),
    list: () => apiService.request('reports_list'),
  }
};
