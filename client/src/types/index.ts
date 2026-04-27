export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    workingHoursPerDay: number;
    preferredStartTime: string;
  };
}

export interface Goal {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  aiAnalysis?: {
    intent: string;
    complexity: 'low' | 'medium' | 'high';
    estimatedDays: number;
    category: string;
    keyMilestones: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  goal: string | { _id: string; title: string };
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  estimatedMinutes: number;
  order: number;
  scheduledDate?: string;
  completedAt?: string;
  isAIGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyPlan {
  _id?: string;
  date: string;
  tasks: PlanTask[];
  totalPlannedMinutes: number;
  totalCompletedMinutes: number;
  aiNotes?: string;
}

export interface PlanTask {
  task: Task | string;
  startTime: string;
  endTime: string;
  completed: boolean;
}

export interface AIAnalysis {
  intent: string;
  complexity: 'low' | 'medium' | 'high';
  estimatedDays: number;
  category: string;
  keyMilestones: string[];
}

export interface AIInsight {
  type: 'strength' | 'improvement' | 'warning' | 'tip';
  title: string;
  description: string;
  icon: string;
}

export interface AIInsightsResponse {
  insights: AIInsight[];
  overallScore: number;
  summary: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
