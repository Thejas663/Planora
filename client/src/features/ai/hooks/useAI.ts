import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '../services/aiService';

export const useGenerateTasks = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (goalId: string) => aiService.generateTasks(goalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

export const useGeneratePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (date: string) => aiService.generatePlan(date),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['planner'] }),
  });
};

export const useReplan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (goalId: string) => aiService.replan(goalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['planner'] });
    },
  });
};

export const useAIInsights = () =>
  useMutation({ mutationFn: aiService.getInsights });
