import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Circle, CheckCircle2, Clock, Trash2, Filter } from 'lucide-react';
import { useTasks, useUpdateTaskStatus, useDeleteTask } from '@/features/tasks/hooks/useTasks';
import { useGoals } from '@/features/goals/hooks/useGoals';
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/common';
import { PriorityBadge } from '@/components/ui/Badge';
import type { Task } from '@/types/index';

export const TasksPage: React.FC = () => {
  const { data: goals = [] } = useGoals();
  const [goalFilter, setGoalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { data: tasks = [], isLoading } = useTasks({
    goal: goalFilter || undefined,
    status: statusFilter || undefined,
  });
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();

  const handleToggle = async (task: Task) => {
    const next: Task['status'] = task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in-progress' : 'done';
    await updateStatus.mutateAsync({ id: task._id, status: next });
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  const grouped = {
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    todo: tasks.filter((t) => t.status === 'todo'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  return (
    <div className="p-8">
      <PageHeader title="Tasks" subtitle={`${tasks.length} tasks total`} />

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          id="tasks-goal-filter"
          value={goalFilter}
          onChange={(e) => setGoalFilter(e.target.value)}
          className="input-field max-w-[200px] text-sm"
        >
          <option value="">All Goals</option>
          {goals.map((g) => <option key={g._id} value={g._id}>{g.title}</option>)}
        </select>
        <select
          id="tasks-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field max-w-[160px] text-sm"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare size={32} />}
          title="No tasks found"
          description="Tasks are created within goals. Head to a goal and generate tasks with AI."
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([status, groupTasks]) => {
            if (groupTasks.length === 0) return null;
            return (
              <div key={status}>
                <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    status === 'done' ? 'bg-success' :
                    status === 'in-progress' ? 'bg-primary-light' : 'bg-text-muted'
                  }`} />
                  {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="text-text-muted font-normal">({groupTasks.length})</span>
                </h3>
                <div className="space-y-2">
                  <AnimatePresence>
                    {groupTasks.map((task, i) => (
                      <motion.div
                        key={task._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex items-center gap-3 p-4 bg-surface border rounded-input transition-all hover:border-border-hover group ${
                          task.status === 'done' ? 'opacity-60' : ''
                        }`}
                      >
                        <button
                          id={`tasks-toggle-${task._id}`}
                          onClick={() => handleToggle(task)}
                          className="flex-shrink-0 text-text-muted hover:text-primary-light transition-colors"
                        >
                          {task.status === 'done' ? (
                            <CheckCircle2 size={20} className="text-success" />
                          ) : task.status === 'in-progress' ? (
                            <div className="w-5 h-5 rounded-full border-2 border-primary-light flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-primary-light" />
                            </div>
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-text-muted truncate mt-0.5">{task.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={task.priority} />
                          <div className="flex items-center gap-1 text-xs text-text-muted">
                            <Clock size={12} />
                            <span>{task.estimatedMinutes}m</span>
                          </div>
                          <button
                            id={`tasks-delete-${task._id}`}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
