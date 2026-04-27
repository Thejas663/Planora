import { getGroqCompletion } from '../../config/groq';
import { AI_PROMPTS } from './ai.prompts';
import { ApiError } from '../../utils/ApiError';

async function callGroq(prompt: string): Promise<any> {
  try {
    const text = await getGroqCompletion(prompt, true);
    if (!text) throw new Error('Empty response from AI');
    return JSON.parse(text);
  } catch (error: any) {
    console.error('Groq API error:', error?.message || error);
    throw ApiError.internal('AI service temporarily unavailable. Please try again.');
  }
}

export const aiService = {
  async analyzeGoal(goalText: string, deadline: string) {
    const prompt = AI_PROMPTS.analyzeGoal(goalText, deadline);
    return callGroq(prompt);
  },

  async generateTasks(
    goalTitle: string,
    goalDescription: string,
    deadline: string,
    complexity: string,
    hoursPerDay: number
  ) {
    const prompt = AI_PROMPTS.generateTasks(
      goalTitle,
      goalDescription,
      deadline,
      complexity,
      hoursPerDay
    );
    const result = await callGroq(prompt);
    return result.tasks || result;
  },

  async generateDailyPlan(
    tasks: any[],
    targetDate: string,
    startTime: string,
    endTime: string,
    totalHours: number
  ) {
    const tasksJson = JSON.stringify(
      tasks.map((t) => ({
        _id: t._id,
        title: t.title,
        priority: t.priority,
        estimatedMinutes: t.estimatedMinutes,
        status: t.status,
        goalTitle: t.goal?.title || 'Unknown Goal',
      }))
    );

    const prompt = AI_PROMPTS.generateDailyPlan(
      tasksJson,
      targetDate,
      startTime,
      endTime,
      totalHours
    );
    return callGroq(prompt);
  },

  async replan(
    missedTasks: any[],
    remainingTasks: any[],
    deadline: string,
    daysLeft: number,
    hoursPerDay: number
  ) {
    const prompt = AI_PROMPTS.replan(
      JSON.stringify(missedTasks),
      JSON.stringify(remainingTasks),
      deadline,
      daysLeft,
      hoursPerDay
    );
    return callGroq(prompt);
  },

  async getInsights(
    completedCount: number,
    missedCount: number,
    avgCompletionRatio: number,
    totalGoals: number,
    goalsCompleted: number,
    weeklyData: string
  ) {
    const prompt = AI_PROMPTS.insights(
      completedCount,
      missedCount,
      avgCompletionRatio,
      totalGoals,
      goalsCompleted,
      weeklyData
    );
    return callGroq(prompt);
  },
};
