import api from '@/lib/axios';
import { Task } from '@/types';

export const taskService = {
  async getAll(filters?: { goal?: string; status?: string; date?: string }): Promise<Task[]> {
    const { data } = await api.get('/tasks', { params: filters });
    return data.data;
  },

  async create(payload: {
    goal: string;
    title: string;
    description?: string;
    priority?: string;
    estimatedMinutes?: number;
    order?: number;
    scheduledDate?: string;
  }): Promise<Task> {
    const { data } = await api.post('/tasks', payload);
    return data.data;
  },

  async update(id: string, payload: Partial<Task>): Promise<Task> {
    const { data } = await api.put(`/tasks/${id}`, payload);
    return data.data;
  },

  async updateStatus(id: string, status: Task['status']): Promise<Task> {
    const { data } = await api.patch(`/tasks/${id}/status`, { status });
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
