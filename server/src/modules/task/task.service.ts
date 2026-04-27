import { Task } from './task.model';
import { goalService } from '../goal/goal.service';
import { ApiError } from '../../utils/ApiError';
import { CreateTaskInput, UpdateTaskInput } from './task.validation';

export const taskService = {
  async getAll(userId: string, filters: { goal?: string; status?: string; date?: string }) {
    const query: any = { user: userId };
    if (filters.goal) query.goal = filters.goal;
    if (filters.status) query.status = filters.status;
    if (filters.date) {
      const date = new Date(filters.date);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      query.scheduledDate = { $gte: start, $lte: end };
    }
    return Task.find(query).sort({ order: 1, createdAt: -1 }).populate('goal', 'title');
  },

  async create(userId: string, input: CreateTaskInput) {
    const task = await Task.create({
      ...input,
      user: userId,
      ...(input.scheduledDate && { scheduledDate: new Date(input.scheduledDate) }),
    });
    // Update goal progress
    await goalService.updateProgress(input.goal, userId);
    return task;
  },

  async bulkCreate(userId: string, goalId: string, tasks: Partial<CreateTaskInput>[]) {
    const taskDocs = tasks.map((t, i) => ({
      ...t,
      user: userId,
      goal: goalId,
      order: t.order ?? i,
      isAIGenerated: true,
    }));
    const created = await Task.insertMany(taskDocs);
    await goalService.updateProgress(goalId, userId);
    return created;
  },

  async update(taskId: string, userId: string, input: UpdateTaskInput) {
    const updateData: any = { ...input };
    if (input.status === 'done') {
      updateData.completedAt = new Date();
    }
    if (input.scheduledDate) {
      updateData.scheduledDate = new Date(input.scheduledDate);
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      updateData,
      { new: true }
    );
    if (!task) throw ApiError.notFound('Task not found');

    // Update goal progress
    await goalService.updateProgress(task.goal.toString(), userId);
    return task;
  },

  async updateStatus(taskId: string, userId: string, status: string) {
    const updateData: any = { status };
    if (status === 'done') {
      updateData.completedAt = new Date();
    } else {
      updateData.completedAt = null;
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      updateData,
      { new: true }
    );
    if (!task) throw ApiError.notFound('Task not found');

    await goalService.updateProgress(task.goal.toString(), userId);
    return task;
  },

  async delete(taskId: string, userId: string) {
    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) throw ApiError.notFound('Task not found');
    await goalService.updateProgress(task.goal.toString(), userId);
    return task;
  },

  async getByGoal(goalId: string, userId: string) {
    return Task.find({ goal: goalId, user: userId }).sort({ order: 1 });
  },

  async getStats(userId: string) {
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, status: 'done' });
    const inProgressTasks = await Task.countDocuments({ user: userId, status: 'in-progress' });
    const todoTasks = await Task.countDocuments({ user: userId, status: 'todo' });

    return { totalTasks, completedTasks, inProgressTasks, todoTasks };
  },
};
