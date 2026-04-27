import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target, CheckSquare, TrendingUp, Clock, Plus, ArrowRight,
  Sparkles, Trophy, AlertTriangle, Lightbulb, Zap
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGoals } from '@/features/goals/hooks/useGoals';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { useAIInsights } from '@/features/ai/hooks/useAI';
import { PageHeader, LoadingSpinner, StatCard, EmptyState } from '@/components/common';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { useCreateGoal } from '@/features/goals/hooks/useGoals';
import type { AIInsight } from '@/types/index';

const iconMap: Record<string, React.ReactNode> = {
  trophy: <Trophy size={16} />,
  'trending-up': <TrendingUp size={16} />,
  'alert-triangle': <AlertTriangle size={16} />,
  lightbulb: <Lightbulb size={16} />,
  zap: <Zap size={16} />,
  target: <Target size={16} />,
};

const insightTypeColors: Record<string, string> = {
  strength: 'text-success border-success/20 bg-success/5',
  improvement: 'text-primary-light border-primary/20 bg-primary/5',
  warning: 'text-warning border-warning/20 bg-warning/5',
  tip: 'text-accent border-accent/20 bg-accent/5',
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: goals = [], isLoading: goalsLoading } = useGoals();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const createGoal = useCreateGoal();
  const aiInsights = useAIInsights();

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({ title: '', description: '', deadline: '' });
  const [goalError, setGoalError] = useState('');

  // Stats
  const activeGoals = goals.filter((g) => g.status === 'active').length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const totalTasks = tasks.length;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setGoalError('');
    try {
      await createGoal.mutateAsync(goalForm);
      setShowGoalModal(false);
      setGoalForm({ title: '', description: '', deadline: '' });
    } catch (err: any) {
      setGoalError(err?.response?.data?.message || 'Failed to create goal');
    }
  };

  if (goalsLoading || tasksLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-text-muted text-sm mb-1">
          {today}
        </motion.p>
        <PageHeader
          title={`${greeting}, ${user?.name?.split(' ')[0]} 👋`}
          subtitle="Here's your productivity overview."
          action={
            <Button
              id="dashboard-new-goal-btn"
              leftIcon={<Plus size={16} />}
              onClick={() => setShowGoalModal(true)}
            >
              New Goal
            </Button>
          }
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Active Goals" value={activeGoals} icon={<Target size={20} />} color="text-primary-light" subtitle="goals in motion" />
        <StatCard title="Tasks Completed" value={completedTasks} icon={<CheckSquare size={20} />} color="text-success" />
        <StatCard title="In Progress" value={inProgressTasks} icon={<Clock size={20} />} color="text-warning" />
        <StatCard title="Total Tasks" value={totalTasks} icon={<TrendingUp size={20} />} color="text-accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Goals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-text-primary">Active Goals</h2>
            <Link to="/goals" id="dashboard-view-all-goals" className="text-sm text-primary-light hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {goals.length === 0 ? (
            <EmptyState
              icon={<Target size={28} />}
              title="No goals yet"
              description="Create your first goal and let AI generate tasks for you."
              action={
                <Button id="dashboard-empty-new-goal" leftIcon={<Plus size={16} />} onClick={() => setShowGoalModal(true)}>
                  Create Goal
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 5).map((goal, i) => (
                <motion.div
                  key={goal._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link to={`/goals/${goal._id}`} id={`goal-card-${goal._id}`}>
                    <div className="card-hover group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-text-primary truncate group-hover:text-primary-light transition-colors">
                            {goal.title}
                          </h3>
                          <p className="text-xs text-text-muted mt-0.5">
                            Due {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <StatusBadge status={goal.status} />
                      </div>
                      <ProgressBar value={goal.progress} showLabel />
                      {goal.aiAnalysis && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                          <Sparkles size={12} className="text-primary-light" />
                          <span>{goal.aiAnalysis.intent}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Recent Tasks */}
          <div className="flex items-center justify-between mt-6">
            <h2 className="font-semibold text-text-primary">Recent Tasks</h2>
            <Link to="/tasks" id="dashboard-view-all-tasks" className="text-sm text-primary-light hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-2">
            {tasks.slice(0, 5).map((task, i) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 bg-surface border border-border rounded-input hover:border-border-hover transition-all"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.status === 'done' ? 'bg-success' :
                    task.status === 'in-progress' ? 'bg-primary-light' : 'bg-text-muted'
                  }`}
                />
                <span className={`flex-1 text-sm truncate ${task.status === 'done' ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                  {task.title}
                </span>
                <PriorityBadge priority={task.priority} />
                <span className="text-xs text-text-muted">{task.estimatedMinutes}m</span>
              </motion.div>
            ))}
            {tasks.length === 0 && (
              <p className="text-center text-text-muted text-sm py-4">No tasks yet. Create a goal and generate tasks with AI.</p>
            )}
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <Sparkles size={16} className="text-primary-light" /> AI Insights
            </h2>
          </div>

          <div className="card border-primary/10 bg-gradient-to-b from-primary/5 to-transparent">
            <p className="text-text-secondary text-sm mb-4">
              Let AI analyze your productivity patterns and give personalized recommendations.
            </p>
            <Button
              id="dashboard-ai-insights-btn"
              variant="secondary"
              size="sm"
              className="w-full"
              isLoading={aiInsights.isPending}
              leftIcon={<Sparkles size={14} />}
              onClick={() => aiInsights.mutate()}
            >
              Generate Insights
            </Button>
          </div>

          {aiInsights.data && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Productivity Score</span>
                <span className="text-2xl font-bold gradient-text">{aiInsights.data.overallScore}/100</span>
              </div>
              <ProgressBar value={aiInsights.data.overallScore} color="accent" size="lg" />

              <p className="text-xs text-text-secondary bg-surface border border-border rounded-input p-3">
                {aiInsights.data.summary}
              </p>

              {aiInsights.data.insights.map((insight: AIInsight, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`border rounded-input p-3 ${insightTypeColors[insight.type] || insightTypeColors.tip}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {iconMap[insight.icon] || <Lightbulb size={14} />}
                    <span className="text-xs font-semibold">{insight.title}</span>
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">{insight.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Quick link to planner */}
          <Link to="/planner" id="dashboard-go-to-planner">
            <div className="card-hover flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Clock size={18} className="text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">Today's Plan</p>
                <p className="text-xs text-text-muted">View & manage today's schedule</p>
              </div>
              <ArrowRight size={16} className="text-text-muted" />
            </div>
          </Link>
        </div>
      </div>

      {/* Create Goal Modal */}
      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title="Create New Goal" size="md">
        <form onSubmit={handleCreateGoal} className="space-y-4" id="create-goal-form">
          <Input
            label="Goal title"
            id="goal-title-input"
            placeholder="e.g., Learn React and build a portfolio project"
            value={goalForm.title}
            onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
            required
          />
          <Textarea
            label="Description (optional)"
            id="goal-description-input"
            placeholder="Describe what success looks like..."
            value={goalForm.description}
            onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
            rows={3}
          />
          <Input
            label="Deadline"
            id="goal-deadline-input"
            type="date"
            value={goalForm.deadline}
            onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          {goalError && (
            <p className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-input px-3 py-2">
              {goalError}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowGoalModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" isLoading={createGoal.isPending} className="flex-1" id="create-goal-submit-btn">
              Create Goal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
