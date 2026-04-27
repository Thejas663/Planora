import api from '@/lib/axios';
import type { Goal } from '@/types/index';

export const goalService = {
  async getAll(): Promise<Goal[]> {
    const { data } = await api.get('/goals');
    return data.data;
  },

  async getById(id: string): Promise<Goal> {
    const { data } = await api.get(`/goals/${id}`);
    return data.data;
  },

  async create(payload: { title: string; description: string; deadline: string }): Promise<Goal> {
    const { data } = await api.post('/goals', payload);
    return data.data;
  },

  async update(id: string, payload: Partial<Goal>): Promise<Goal> {
    const { data } = await api.put(`/goals/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/goals/${id}`);
  },
};
