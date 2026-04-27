import { z } from 'zod';

export const createTaskSchema = z.object({
  goal: z.string().min(1, 'Goal ID is required'),
  title: z.string().min(1, 'Title is required').max(300),
  description: z.string().max(1000).optional().default(''),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  estimatedMinutes: z.number().min(5).max(480).optional().default(30),
  order: z.number().optional().default(0),
  scheduledDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date').optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  description: z.string().max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  estimatedMinutes: z.number().min(5).max(480).optional(),
  order: z.number().optional(),
  scheduledDate: z.string().optional().nullable(),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['todo', 'in-progress', 'done']),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
