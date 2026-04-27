import api from '@/lib/axios';
import type { AIAnalysis, AIInsightsResponse, Task } from '@/types/index';

export const aiService = {
  async analyzeGoal(goalText: string, deadline: string): Promise<AIAnalysis> {
    const { data } = await api.post('/ai/analyze-goal', { goalText, deadline });
    return data.data;
  },

  async generateTasks(goalId: string): Promise<Task[]> {
    const { data } = await api.post('/ai/generate-tasks', { goalId });
    return data.data;
  },

  async generatePlan(date: string): Promise<any> {
    const { data } = await api.post('/ai/generate-plan', { date });
    return data.data;
  },

  async replan(goalId: string): Promise<any> {
    const { data } = await api.post('/ai/replan', { goalId });
    return data.data;
  },

  async getInsights(): Promise<AIInsightsResponse> {
    const { data } = await api.post('/ai/insights', {});
    return data.data;
  },
};
