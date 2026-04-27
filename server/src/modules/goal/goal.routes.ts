import { Router } from 'express';
import { goalController } from './goal.controller';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { createGoalSchema, updateGoalSchema } from './goal.validation';

const router = Router();

router.use(authMiddleware);

router.get('/', goalController.getAll);
router.post('/', validate(createGoalSchema), goalController.create);
router.get('/:id', goalController.getById);
router.put('/:id', validate(updateGoalSchema), goalController.update);
router.delete('/:id', goalController.delete);

export default router;
