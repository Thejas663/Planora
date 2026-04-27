import { Response } from 'express';
import { goalService } from './goal.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { AuthRequest } from '../../middleware/auth.middleware';

export const goalController = {
  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const goals = await goalService.getAll(req.userId!);
    res.json(ApiResponse.success(goals));
  }),

  getById: asyncHandler(async (req: AuthRequest, res: Response) => {
    const goal = await goalService.getById(req.params.id as string, req.userId!);
    res.json(ApiResponse.success(goal));
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const goal = await goalService.create(req.userId!, req.body);
    res.status(201).json(ApiResponse.success(goal, 'Goal created'));
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const goal = await goalService.update(req.params.id as string, req.userId!, req.body);
    res.json(ApiResponse.success(goal, 'Goal updated'));
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    await goalService.delete(req.params.id as string, req.userId!);
    res.json(ApiResponse.success(null, 'Goal deleted'));
  }),
};
