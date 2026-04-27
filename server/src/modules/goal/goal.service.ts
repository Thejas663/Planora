import { Goal } from './goal.model';
import { Task } from '../task/task.model';
import { ApiError } from '../../utils/ApiError';
import { CreateGoalInput, UpdateGoalInput } from './goal.validation';

export const goalService = {
  async getAll(userId: string) {
    return Goal.find({ user: userId }).sort({ createdAt: -1 });
  },

  async getById(goalId: string, userId: string) {
    const goal = await Goal.findOne({ _id: goalId, user: userId });
    if (!goal) throw ApiError.notFound('Goal not found');
    return goal;
  },

  async create(userId: string, input: CreateGoalInput) {
    return Goal.create({
      ...input,
      user: userId,
      deadline: new Date(input.deadline),
    });
  },

  async update(goalId: string, userId: string, input: UpdateGoalInput) {
    const goal = await Goal.findOneAndUpdate(
      { _id: goalId, user: userId },
      {
        ...input,
        ...(input.deadline && { deadline: new Date(input.deadline) }),
      },
      { new: true }
    );
    if (!goal) throw ApiError.notFound('Goal not found');
    return goal;
  },

  async delete(goalId: string, userId: string) {
    const goal = await Goal.findOneAndDelete({ _id: goalId, user: userId });
    if (!goal) throw ApiError.notFound('Goal not found');
    // Also delete related tasks
    await Task.deleteMany({ goal: goalId, user: userId });
    return goal;
  },

  async updateProgress(goalId: string, userId: string) {
    const tasks = await Task.find({ goal: goalId, user: userId });
    if (tasks.length === 0) return;

    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const progress = Math.round((completedTasks / tasks.length) * 100);

    await Goal.findByIdAndUpdate(goalId, { progress });
    return progress;
  },
};
