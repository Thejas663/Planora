import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, TrendingUp, AlertTriangle, Lightbulb, Zap, Target, RefreshCw } from 'lucide-react';
import { useAIInsights } from '@/features/ai/hooks/useAI';
import { PageHeader, LoadingSpinner } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { AIInsight } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  'trending-up': TrendingUp,
  'alert-triangle': AlertTriangle,
  lightbulb: Lightbulb,
  zap: Zap,
  target: Target,
};

const typeStyles: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  strength:    { border: 'border-success/20',  bg: 'bg-success/5',  text: 'text-success',       badge: 'bg-success/15 text-success' },
  improvement: { border: 'border-primary/20',  bg: 'bg-primary/5',  text: 'text-primary-light', badge: 'bg-primary/15 text-primary-light' },
  warning:     { border: 'border-warning/20',  bg: 'bg-warning/5',  text: 'text-warning',       badge: 'bg-warning/15 text-warning' },
  tip:         { border: 'border-accent/20',   bg: 'bg-accent/5',   text: 'text-accent',        badge: 'bg-accent/15 text-accent' },
};

export const InsightsPage: React.FC = () => {
  const aiInsights = useAIInsights();

  return (
    <div className="p-8">
      <PageHeader
        title="AI Insights"
        subtitle="Personalized productivity analysis powered by Gemini AI"
        action={
          <Button
            id="insights-generate-btn"
            leftIcon={<Sparkles size={16} />}
            isLoading={aiInsights.isPending}
            onClick={() => aiInsights.mutate()}
          >
            {aiInsights.data ? 'Refresh Insights' : 'Generate Insights'}
          </Button>
        }
      />

      {aiInsights.isPending && <LoadingSpinner size="lg" />}

      {!aiInsights.data && !aiInsights.isPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/10 flex items-center justify-center mb-6 shadow-glow">
            <Sparkles size={40} className="text-primary-light" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">Ready for your insight report?</h2>
          <p className="text-text-secondary max-w-md mb-8">
            Planora's AI analyzes your goals, task completion patterns, and productivity trends to give you personalized recommendations.
          </p>
          <Button
            id="insights-empty-generate-btn"
            size="lg"
            leftIcon={<Sparkles size={18} />}
            onClick={() => aiInsights.mutate()}
          >
            Generate My Insights
          </Button>
        </motion.div>
      )}

      {aiInsights.data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Score card */}
          <div className="card border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Productivity Score</h2>
                <p className="text-text-secondary text-sm mt-1">{aiInsights.data.summary}</p>
              </div>
              <div className="text-6xl font-black gradient-text">
                {aiInsights.data.overallScore}
                <span className="text-2xl text-text-muted">/100</span>
              </div>
            </div>
            <ProgressBar
              value={aiInsights.data.overallScore}
              color={aiInsights.data.overallScore >= 70 ? 'success' : aiInsights.data.overallScore >= 40 ? 'accent' : 'warning'}
              size="lg"
            />
          </div>

          {/* Insights grid */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">
              Insights ({aiInsights.data.insights.length})
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {aiInsights.data.insights.map((insight: AIInsight, i: number) => {
                const styles = typeStyles[insight.type] || typeStyles.tip;
                const IconComp = iconMap[insight.icon] || Lightbulb;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`card ${styles.border} ${styles.bg}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${styles.badge}`}>
                        <IconComp size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className={`font-semibold text-sm ${styles.text}`}>{insight.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-badge ${styles.badge}`}>
                            {insight.type}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Refresh */}
          <div className="flex justify-center pt-4">
            <Button
              id="insights-refresh-btn"
              variant="ghost"
              leftIcon={<RefreshCw size={14} />}
              onClick={() => aiInsights.mutate()}
              isLoading={aiInsights.isPending}
            >
              Refresh Analysis
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
