import { Router } from 'express';
import { aiController } from './ai.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/analyze-goal', aiController.analyzeGoal);
router.post('/generate-tasks', aiController.generateTasks);
router.post('/generate-plan', aiController.generatePlan);
router.post('/replan', aiController.replan);
router.post('/insights', aiController.insights);

export default router;
