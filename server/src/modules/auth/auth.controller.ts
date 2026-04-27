import { Request, Response } from 'express';
import { authService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { AuthRequest } from '../../middleware/auth.middleware';

export const authController = {
  signup: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.signup(req.body);
    res.status(201).json(ApiResponse.success(result, 'Account created successfully'));
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.json(ApiResponse.success(result, 'Login successful'));
  }),

  getMe: asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await authService.getMe(req.userId!);
    res.json(ApiResponse.success(user));
  }),
};
