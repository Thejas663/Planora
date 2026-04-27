import api from '@/lib/axios';
import type { User } from '@/types/index';

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/signup', { name, email, password });
    return data.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data.data;
  },
};
