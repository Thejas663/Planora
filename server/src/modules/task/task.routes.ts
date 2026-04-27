import { Router } from 'express';
import { taskController } from './task.controller';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from './task.validation';

const router = Router();

router.use(authMiddleware);

router.get('/', taskController.getAll);
router.post('/', validate(createTaskSchema), taskController.create);
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.patch('/:id/status', validate(updateTaskStatusSchema), taskController.updateStatus);
router.delete('/:id', taskController.delete);

export default router;
