import { Response } from 'express';
import { plannerService } from './planner.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { AuthRequest } from '../../middleware/auth.middleware';

export const plannerController = {
  getPlan: asyncHandler(async (req: AuthRequest, res: Response) => {
    const plan = await plannerService.getPlan(req.userId!, req.params.date as string);
    res.json(ApiResponse.success(plan));
  }),

  savePlan: asyncHandler(async (req: AuthRequest, res: Response) => {
    const plan = await plannerService.savePlan(req.userId!, req.params.date as string, req.body);
    res.json(ApiResponse.success(plan, 'Plan saved'));
  }),

  completeTask: asyncHandler(async (req: AuthRequest, res: Response) => {
    const plan = await plannerService.completeTask(
      req.userId!,
      req.params.date as string,
      req.params.taskId as string
    );
    res.json(ApiResponse.success(plan, 'Task toggled'));
  }),

  getWeeklyStats: asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await plannerService.getWeeklyStats(req.userId!);
    res.json(ApiResponse.success(stats));
  }),
};
