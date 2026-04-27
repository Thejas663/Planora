import { Response } from 'express';
import { taskService } from './task.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { AuthRequest } from '../../middleware/auth.middleware';

export const taskController = {
  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const tasks = await taskService.getAll(req.userId!, {
      goal: req.query.goal as string,
      status: req.query.status as string,
      date: req.query.date as string,
    });
    res.json(ApiResponse.success(tasks));
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const task = await taskService.create(req.userId!, req.body);
    res.status(201).json(ApiResponse.success(task, 'Task created'));
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const task = await taskService.update(req.params.id as string, req.userId!, req.body);
    res.json(ApiResponse.success(task, 'Task updated'));
  }),

  updateStatus: asyncHandler(async (req: AuthRequest, res: Response) => {
    const task = await taskService.updateStatus(req.params.id as string, req.userId!, req.body.status);
    res.json(ApiResponse.success(task, 'Status updated'));
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    await taskService.delete(req.params.id as string, req.userId!);
    res.json(ApiResponse.success(null, 'Task deleted'));
  }),
};
