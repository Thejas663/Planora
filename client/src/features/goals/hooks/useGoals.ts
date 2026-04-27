import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalService } from '../services/goalService';
import { Goal } from '@/types';

export const useGoals = () =>
  useQuery({ queryKey: ['goals'], queryFn: goalService.getAll });

export const useGoal = (id: string) =>
  useQuery({ queryKey: ['goals', id], queryFn: () => goalService.getById(id), enabled: !!id });

export const useCreateGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: goalService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
};

export const useUpdateGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Goal> }) =>
      goalService.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['goals'] });
      qc.invalidateQueries({ queryKey: ['goals', vars.id] });
    },
  });
};

export const useDeleteGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: goalService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  });
};
