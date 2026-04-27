import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Sparkles, Plus, Trash2, CheckCircle2, Circle,
  Clock, Calendar, Edit3, RefreshCw, Target, Brain
} from 'lucide-react';
import { useGoal, useUpdateGoal, useDeleteGoal } from '@/features/goals/hooks/useGoals';
import { useTasks, useCreateTask, useUpdateTaskStatus, useDeleteTask } from '@/features/tasks/hooks/useTasks';
import { useGenerateTasks, useReplan } from '@/features/ai/hooks/useAI';
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/common';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge, PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import type { Task } from '@/types/index';

export const GoalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: goal, isLoading } = useGoal(id!);
  const { data: tasks = [] } = useTasks({ goal: id });
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const createTask = useCreateTask();
  const updateTaskStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();
  const generateTasks = useGenerateTasks();
  const replan = useReplan();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    estimatedMinutes: 30,
  });
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');

  const filteredTasks = tasks.filter((t) => filter === 'all' || t.status === filter);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask.mutateAsync({ ...taskForm, goal: id! });
    setShowTaskModal(false);
    setTaskForm({ title: '', description: '', priority: 'medium', estimatedMinutes: 30 });
  };

  const handleToggleStatus = async (task: Task) => {
    const next: Task['status'] = task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in-progress' : 'done';
    await updateTaskStatus.mutateAsync({ id: task._id, status: next });
  };

  const handleDeleteGoal = async () => {
    if (window.confirm('Delete this goal and all its tasks?')) {
      await deleteGoal.mutateAsync(id!);
      navigate('/goals');
    }
  };

  const handleGenerateTasks = async () => {
    await generateTasks.mutateAsync(id!);
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!goal) return <div className="p-8 text-text-muted">Goal not found.</div>;

  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const complexityColor = {
    low: 'text-success',
    medium: 'text-warning',
    high: 'text-danger',
  }[goal.aiAnalysis?.complexity || 'medium'];

  return (
    <div className="p-8">
      {/* Back */}
      <button
        onClick={() => navigate('/goals')}
        id="goal-detail-back-btn"
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Back to Goals
      </button>

      {/* Goal Header */}
      <div className="card mb-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <StatusBadge status={goal.status} />
              {goal.aiAnalysis && (
                <span className={`badge bg-surface-hover ${complexityColor}`}>
                  {goal.aiAnalysis.complexity} complexity
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">{goal.title}</h1>
            {goal.description && (
              <p className="text-text-secondary text-sm mb-4">{goal.description}</p>
            )}

            <div className="flex items-center gap-6 text-sm text-text-secondary mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>
                  {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className={`flex items-center gap-1.5 ${daysLeft < 7 ? 'text-danger' : daysLeft < 14 ? 'text-warning' : ''}`}>
                <Clock size={14} />
                <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}</span>
              </div>
              {goal.aiAnalysis && (
                <div className="flex items-center gap-1.5 text-text-muted">
                  <Brain size={14} className="text-primary-light" />
                  <span>{goal.aiAnalysis.estimatedDays} days estimated</span>
                </div>
              )}
            </div>

            <ProgressBar value={goal.progress} showLabel size="lg" />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              id="goal-generate-tasks-btn"
              leftIcon={<Sparkles size={14} />}
              isLoading={generateTasks.isPending}
              onClick={handleGenerateTasks}
              variant="secondary"
              size="sm"
            >
              AI Generate Tasks
            </Button>
            <Button
              id="goal-replan-btn"
              leftIcon={<RefreshCw size={14} />}
              isLoading={replan.isPending}
              onClick={() => replan.mutateAsync(id!)}
              variant="secondary"
              size="sm"
            >
              Replan
            </Button>
            <Button
              id="goal-delete-btn"
              leftIcon={<Trash2 size={14} />}
              variant="danger"
              size="sm"
              onClick={handleDeleteGoal}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      {goal.aiAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6 border-primary/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-primary-light" />
            <h2 className="font-semibold text-text-primary">AI Analysis</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider">Intent</span>
              <p className="text-sm text-text-primary mt-1">{goal.aiAnalysis.intent}</p>
            </div>
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider">Category</span>
              <p className="text-sm text-text-primary mt-1">{goal.aiAnalysis.category}</p>
            </div>
            {goal.aiAnalysis.keyMilestones?.length > 0 && (
              <div className="md:col-span-2">
                <span className="text-xs text-text-muted uppercase tracking-wider">Key Milestones</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {goal.aiAnalysis.keyMilestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs bg-surface-hover border border-border rounded-badge px-2.5 py-1 text-text-secondary">
                      <div className="w-1 h-1 rounded-full bg-primary-light" />
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-semibold text-text-primary">
            Tasks <span className="text-text-muted text-sm font-normal">({tasks.length})</span>
          </h2>
          <div className="flex items-center gap-2">
            {/* Filter tabs */}
            <div className="flex bg-surface border border-border rounded-input p-1 text-xs">
              {(['all', 'todo', 'in-progress', 'done'] as const).map((f) => (
                <button
                  key={f}
                  id={`task-filter-${f}`}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded transition-all ${
                    filter === f ? 'bg-primary/20 text-primary-light' : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <Button id="goal-add-task-btn" leftIcon={<Plus size={14} />} size="sm" onClick={() => setShowTaskModal(true)}>
              Add Task
            </Button>
          </div>
        </div>

        {/* Task list */}
        {filteredTasks.length === 0 ? (
          tasks.length === 0 ? (
            <EmptyState
              icon={<Target size={28} />}
              title="No tasks yet"
              description="Use AI to generate tasks automatically, or add them manually."
              action={
                <div className="flex gap-3">
                  <Button id="empty-generate-tasks-btn" leftIcon={<Sparkles size={14} />} isLoading={generateTasks.isPending} onClick={handleGenerateTasks} size="sm">
                    AI Generate Tasks
                  </Button>
                  <Button id="empty-add-task-btn" variant="secondary" leftIcon={<Plus size={14} />} onClick={() => setShowTaskModal(true)} size="sm">
                    Add Manually
                  </Button>
                </div>
              }
            />
          ) : (
            <p className="text-center text-text-muted py-8 text-sm">No tasks matching this filter.</p>
          )
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredTasks.map((task, i) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-3 p-4 bg-surface border rounded-input transition-all hover:border-border-hover group ${
                    task.status === 'done' ? 'border-success/10 bg-success/5' : 'border-border'
                  }`}
                >
                  <button
                    id={`task-toggle-${task._id}`}
                    onClick={() => handleToggleStatus(task)}
                    className="flex-shrink-0 text-text-muted hover:text-primary-light transition-colors"
                  >
                    {task.status === 'done' ? (
                      <CheckCircle2 size={20} className="text-success" />
                    ) : task.status === 'in-progress' ? (
                      <div className="w-5 h-5 rounded-full border-2 border-primary-light border-t-transparent animate-spin" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-text-muted truncate mt-0.5">{task.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {task.isAIGenerated && (
                      <span title="AI Generated" className="text-primary-light opacity-60">
                        <Sparkles size={12} />
                      </span>
                    )}
                    <PriorityBadge priority={task.priority} />
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Clock size={12} />
                      <span>{task.estimatedMinutes}m</span>
                    </div>
                    <button
                      id={`task-delete-${task._id}`}
                      onClick={() => deleteTask.mutateAsync(task._id)}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Add Task" size="md">
        <form onSubmit={handleCreateTask} className="space-y-4" id="create-task-form">
          <Input
            label="Task title"
            id="task-title-input"
            placeholder="e.g., Research competing products"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            id="task-description-input"
            placeholder="Optional details..."
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-1.5">Priority</label>
              <select
                id="task-priority-select"
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Task['priority'] })}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Input
              label="Est. time (min)"
              id="task-time-input"
              type="number"
              min={5}
              max={480}
              value={taskForm.estimatedMinutes}
              onChange={(e) => setTaskForm({ ...taskForm, estimatedMinutes: parseInt(e.target.value) })}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowTaskModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" isLoading={createTask.isPending} className="flex-1" id="create-task-submit-btn">
              Add Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
