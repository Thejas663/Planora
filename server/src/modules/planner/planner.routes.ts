import { Router } from 'express';
import { plannerController } from './planner.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/stats/weekly', plannerController.getWeeklyStats);
router.get('/:date', plannerController.getPlan);
router.put('/:date', plannerController.savePlan);
router.patch('/:date/tasks/:taskId/toggle', plannerController.completeTask);

export default router;
