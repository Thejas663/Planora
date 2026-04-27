import { DailyPlan } from './planner.model';
import { Task } from '../task/task.model';
import { ApiError } from '../../utils/ApiError';

export const plannerService = {
  async getPlan(userId: string, dateStr: string) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    let plan = await DailyPlan.findOne({ user: userId, date })
      .populate({
        path: 'tasks.task',
        populate: { path: 'goal', select: 'title' },
      });

    if (!plan) {
      // Return empty plan structure
      return {
        date,
        tasks: [],
        totalPlannedMinutes: 0,
        totalCompletedMinutes: 0,
        aiNotes: '',
      };
    }

    return plan;
  },

  async savePlan(userId: string, dateStr: string, planData: any) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    const plan = await DailyPlan.findOneAndUpdate(
      { user: userId, date },
      {
        user: userId,
        date,
        tasks: planData.tasks,
        totalPlannedMinutes: planData.totalPlannedMinutes || 0,
        totalCompletedMinutes: planData.totalCompletedMinutes || 0,
        aiNotes: planData.aiNotes || '',
      },
      { upsert: true, new: true }
    );

    return plan;
  },

  async completeTask(userId: string, dateStr: string, taskId: string) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    const plan = await DailyPlan.findOne({ user: userId, date });
    if (!plan) throw ApiError.notFound('Plan not found');

    const planTask = plan.tasks.find((t) => t.task.toString() === taskId);
    if (!planTask) throw ApiError.notFound('Task not in plan');

    planTask.completed = !planTask.completed;

    // Recalculate completed minutes
    const task = await Task.findById(taskId);
    if (task) {
      if (planTask.completed) {
        plan.totalCompletedMinutes += task.estimatedMinutes;
        task.status = 'done';
        task.completedAt = new Date();
      } else {
        plan.totalCompletedMinutes = Math.max(0, plan.totalCompletedMinutes - task.estimatedMinutes);
        task.status = 'todo';
        task.completedAt = undefined;
      }
      await task.save();
    }

    await plan.save();
    return plan;
  },

  async getWeeklyStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const plans = await DailyPlan.find({
      user: userId,
      date: { $gte: weekAgo, $lte: today },
    });

    const totalPlanned = plans.reduce((sum, p) => sum + p.totalPlannedMinutes, 0);
    const totalCompleted = plans.reduce((sum, p) => sum + p.totalCompletedMinutes, 0);
    const daysActive = plans.length;

    return {
      totalPlanned,
      totalCompleted,
      daysActive,
      completionRate: totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0,
    };
  },
};
