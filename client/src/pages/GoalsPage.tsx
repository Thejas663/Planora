import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Plus, Clock, ArrowRight } from 'lucide-react';
import { useGoals, useCreateGoal } from '@/features/goals/hooks/useGoals';
import { PageHeader, LoadingSpinner, EmptyState } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/Badge';

export const GoalsPage: React.FC = () => {
  const { data: goals = [], isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', deadline: '' });
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');

  const filtered = goals.filter((g) => statusFilter === 'all' || g.status === statusFilter);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createGoal.mutateAsync(form);
      setShowModal(false);
      setForm({ title: '', description: '', deadline: '' });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create goal');
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="p-8">
      <PageHeader
        title="Goals"
        subtitle={`${goals.filter(g => g.status === 'active').length} active goals`}
        action={
          <Button id="goals-new-btn" leftIcon={<Plus size={16} />} onClick={() => setShowModal(true)}>
            New Goal
          </Button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'completed', 'paused'] as const).map((s) => (
          <button
            key={s}
            id={`goals-filter-${s}`}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-badge text-sm font-medium transition-all ${
              statusFilter === s
                ? 'bg-primary/20 text-primary-light border border-primary/20'
                : 'text-text-muted hover:text-text-secondary border border-transparent'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        goals.length === 0 ? (
          <EmptyState
            icon={<Target size={32} />}
            title="Set your first goal"
            description="Create a goal and AI will break it down into actionable tasks and a smart schedule."
            action={<Button id="goals-empty-create-btn" leftIcon={<Plus size={16} />} onClick={() => setShowModal(true)}>Create Goal</Button>}
          />
        ) : (
          <p className="text-center text-text-muted py-12">No {statusFilter} goals.</p>
        )
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((goal, i) => {
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return (
              <motion.div
                key={goal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={`/goals/${goal._id}`} id={`goals-item-${goal._id}`}>
                  <div className="card-hover h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <StatusBadge status={goal.status} />
                      <div className={`text-xs ${daysLeft < 7 ? 'text-danger' : daysLeft < 14 ? 'text-warning' : 'text-text-muted'} flex items-center gap-1`}>
                        <Clock size={12} />
                        {daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}
                      </div>
                    </div>

                    <h3 className="font-semibold text-text-primary mb-2 group-hover:text-primary-light transition-colors line-clamp-2">
                      {goal.title}
                    </h3>

                    {goal.description && (
                      <p className="text-sm text-text-secondary mb-3 line-clamp-2">{goal.description}</p>
                    )}

                    <div className="mt-auto pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                        <span>{goal.progress}% complete</span>
                        <span>{new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                      <ProgressBar value={goal.progress} size="sm" />
                    </div>

                    <div className="flex items-center justify-end mt-3 text-primary-light text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View details <ArrowRight size={12} className="ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Goal">
        <form onSubmit={handleCreate} className="space-y-4" id="goals-create-form">
          <Input label="Goal title" id="goals-title-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What do you want to achieve?" required />
          <Textarea label="Description" id="goals-desc-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the goal in more detail..." rows={3} />
          <Input label="Deadline" id="goals-deadline-input" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} min={new Date().toISOString().split('T')[0]} required />
          {error && <p className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-input px-3 py-2">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" isLoading={createGoal.isPending} className="flex-1" id="goals-create-submit-btn">Create Goal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
