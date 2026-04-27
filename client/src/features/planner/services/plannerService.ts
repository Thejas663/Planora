import api from '@/lib/axios';
import { DailyPlan } from '@/types';

export const plannerService = {
  async getPlan(date: string): Promise<DailyPlan> {
    const { data } = await api.get(`/planner/${date}`);
    return data.data;
  },

  async savePlan(date: string, plan: Partial<DailyPlan>): Promise<DailyPlan> {
    const { data } = await api.put(`/planner/${date}`, plan);
    return data.data;
  },

  async toggleTask(date: string, taskId: string): Promise<DailyPlan> {
    const { data } = await api.patch(`/planner/${date}/tasks/${taskId}/toggle`);
    return data.data;
  },

  async getWeeklyStats(): Promise<{
    totalPlanned: number;
    totalCompleted: number;
    daysActive: number;
    completionRate: number;
  }> {
    const { data } = await api.get('/planner/stats/weekly');
    return data.data;
  },
};
