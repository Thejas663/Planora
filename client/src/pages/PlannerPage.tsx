import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Sparkles, Clock, CheckCircle2, Circle,
  Calendar
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { plannerService } from '@/features/planner/services/plannerService';
import { useGeneratePlan } from '@/features/ai/hooks/useAI';
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PriorityBadge } from '@/components/ui/Badge';
import { queryClient } from '@/lib/queryClient';
import type { Task } from '@/types/index';

const dateKey = (d: Date) => d.toISOString().split('T')[0];

const getWeekDates = (refDate: Date) => {
  const dow = refDate.getDay();
  const monday = new Date(refDate);
  monday.setDate(refDate.getDate() - (dow === 0 ? 6 : dow - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

export const PlannerPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekDates = getWeekDates(currentDate);
  const generatePlan = useGeneratePlan();

  const selectedKey = dateKey(selectedDate);

  const { data: plan, isLoading } = useQuery({
    queryKey: ['planner', selectedKey],
    queryFn: () => plannerService.getPlan(selectedKey),
  });

  const handleToggleTask = async (taskId: string) => {
    await plannerService.toggleTask(selectedKey, taskId);
    queryClient.invalidateQueries({ queryKey: ['planner', selectedKey] });
  };

  const handleGeneratePlan = async () => {
    await generatePlan.mutateAsync(selectedKey);
    queryClient.invalidateQueries({ queryKey: ['planner', selectedKey] });
  };

  const completionRate = plan?.totalPlannedMinutes
    ? Math.round((plan.totalCompletedMinutes / plan.totalPlannedMinutes) * 100)
    : 0;

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = dateKey(new Date());

  return (
    <div className="p-8">
      <PageHeader
        title="Daily Planner"
        subtitle="Your AI-generated daily schedule"
        action={
          <Button
            id="planner-generate-btn"
            leftIcon={<Sparkles size={14} />}
            isLoading={generatePlan.isPending}
            onClick={handleGeneratePlan}
            variant="secondary"
          >
            Generate Plan with AI
          </Button>
        }
      />

      {/* Week Calendar */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-text-primary">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button
              id="planner-prev-week"
              onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() - 7);
                setCurrentDate(d);
              }}
              className="p-1.5 rounded-input hover:bg-surface-hover transition text-text-secondary hover:text-text-primary"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              id="planner-today-btn"
              onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}
              className="px-3 py-1 text-xs rounded-input border border-border hover:border-primary/30 text-text-secondary hover:text-primary-light transition-all"
            >
              Today
            </button>
            <button
              id="planner-next-week"
              onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() + 7);
                setCurrentDate(d);
              }}
              className="p-1.5 rounded-input hover:bg-surface-hover transition text-text-secondary hover:text-text-primary"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDates.map((date, i) => {
            const key = dateKey(date);
            const isSelected = key === selectedKey;
            const isToday = key === today;
            return (
              <motion.button
                key={key}
                id={`planner-day-${key}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(date)}
                className={`
                  flex flex-col items-center gap-1 p-3 rounded-input transition-all
                  ${isSelected
                    ? 'bg-primary/20 border border-primary/30 text-primary-light'
                    : isToday
                    ? 'border border-border-hover text-text-primary'
                    : 'hover:bg-surface-hover text-text-secondary'
                  }
                `}
              >
                <span className="text-xs font-medium">{dayNames[i]}</span>
                <span className={`text-lg font-bold ${isSelected ? 'text-primary-light' : isToday ? 'text-text-primary' : ''}`}>
                  {date.getDate()}
                </span>
                {isToday && !isSelected && <div className="w-1 h-1 rounded-full bg-primary-light" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Plan */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : !plan || plan.tasks.length === 0 ? (
            <EmptyState
              icon={<Calendar size={32} />}
              title="No plan for this day"
              description="Use AI to generate an optimal schedule based on your pending tasks."
              action={
                <Button
                  id="planner-empty-generate-btn"
                  leftIcon={<Sparkles size={14} />}
                  isLoading={generatePlan.isPending}
                  onClick={handleGeneratePlan}
                >
                  Generate with AI
                </Button>
              }
            />
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {plan.tasks.map((planTask, i) => {
                  const task = planTask.task as Task;
                  if (!task || typeof task === 'string') return null;
                  return (
                    <motion.div
                      key={`${task._id}-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-input border transition-all ${
                        planTask.completed
                          ? 'bg-success/5 border-success/15 opacity-70'
                          : 'bg-surface border-border hover:border-border-hover'
                      }`}
                    >
                      {/* Time block */}
                      <div className="text-center w-16 flex-shrink-0">
                        <div className="text-xs text-text-muted font-medium">{planTask.startTime}</div>
                        <div className="w-0.5 h-2 bg-border mx-auto my-0.5" />
                        <div className="text-xs text-text-muted">{planTask.endTime}</div>
                      </div>

                      {/* Vertical line */}
                      <div className={`w-0.5 h-10 rounded-full flex-shrink-0 ${planTask.completed ? 'bg-success' : 'bg-primary/40'}`} />

                      {/* Task info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${planTask.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <PriorityBadge priority={task.priority} />
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <Clock size={10} />
                            {task.estimatedMinutes}m
                          </span>
                        </div>
                      </div>

                      {/* Toggle */}
                      <button
                        id={`planner-toggle-${task._id}`}
                        onClick={() => handleToggleTask(task._id)}
                        className="flex-shrink-0 text-text-muted hover:text-success transition-colors"
                      >
                        {planTask.completed ? (
                          <CheckCircle2 size={22} className="text-success" />
                        ) : (
                          <Circle size={22} />
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Day Summary */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-text-primary mb-4">Day Summary</h3>
            {plan && plan.tasks.length > 0 ? (
              <>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Planned</span>
                    <span className="text-text-primary font-medium">{Math.round(plan.totalPlannedMinutes / 60 * 10) / 10}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Completed</span>
                    <span className="text-success font-medium">{Math.round(plan.totalCompletedMinutes / 60 * 10) / 10}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Tasks</span>
                    <span className="text-text-primary font-medium">
                      {plan.tasks.filter((t) => t.completed).length}/{plan.tasks.length}
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-text-muted mb-2">
                    <span>Completion</span>
                    <span>{completionRate}%</span>
                  </div>
                  <ProgressBar value={completionRate} color="success" />
                </div>

                {plan.aiNotes && (
                  <div className="mt-4 bg-primary/5 border border-primary/10 rounded-input p-3">
                    <div className="flex items-center gap-1.5 text-xs text-primary-light mb-1">
                      <Sparkles size={12} />
                      <span className="font-medium">AI Notes</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{plan.aiNotes}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-text-muted text-sm text-center py-4">Generate a plan to see your day summary.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
