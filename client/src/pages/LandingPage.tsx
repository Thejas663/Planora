import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Target, Brain, Calendar, ArrowRight, CheckCircle, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const features = [
  {
    icon: Brain,
    title: 'AI Goal Understanding',
    desc: 'Describe your goal in plain English. Planora extracts intent, complexity, and generates a smart timeline.',
    color: 'text-primary-light',
    bg: 'bg-primary/10',
  },
  {
    icon: Zap,
    title: 'Instant Task Generation',
    desc: 'One click turns any goal into a structured, prioritized, and sequenced task list — built by AI.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Calendar,
    title: 'Smart Daily Planning',
    desc: "Your tasks are intelligently distributed across available days, respecting your schedule.",
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: TrendingUp,
    title: 'Dynamic Replanning',
    desc: 'Missed a day? AI automatically redistributes your workload so you never lose momentum.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
];

const testimonials = [
  { name: 'Arjun S.', role: 'Software Engineer', text: 'I set a goal to "learn system design" and got 12 structured tasks in seconds. Landed my dream job in 3 months.' },
  { name: 'Priya K.', role: 'Product Manager', text: "The daily planner is a game-changer. It feels like having a personal productivity coach available 24/7." },
  { name: 'Marcus L.', role: 'Startup Founder', text: "Planora helped me go from 'launch a product' to a full 60-day plan in under 2 minutes. Incredible." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">Planora</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/signup" id="nav-signup-btn">
              <Button variant="primary">Get started free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <motion.div style={{ y }} className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary-light text-sm px-4 py-2 rounded-full mb-8">
              <Sparkles size={14} />
              <span>AI-Powered Productivity Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Turn your goals into
              <span className="block gradient-text mt-1">daily actions</span>
            </h1>

            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Planora uses Gemini AI to transform any high-level goal into a structured task list and an intelligent daily schedule — automatically.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" id="hero-cta-btn">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight size={20} />}>
                  Start planning for free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary">
                  Sign in
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-text-muted">
              {['No credit card required', 'Free plan available', 'AI-powered from day one'].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-success" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4">
              Everything you need to <span className="gradient-text">actually get things done</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-text-secondary text-lg max-w-2xl mx-auto">
              Unlike generic todo apps, AI is deeply woven into every step of your workflow.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={itemVariants} whileHover={{ y: -4 }} className="card-hover">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon size={22} className={f.color} />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-y border-border bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4">
              From idea to <span className="gradient-text">executed plan</span> in minutes
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Set your goal', desc: 'Type your goal in plain language. Add a deadline. That\'s it.' },
              { step: '02', title: 'AI generates tasks', desc: 'Gemini AI breaks it into prioritized, time-estimated tasks in logical order.' },
              { step: '03', title: 'Follow your plan', desc: 'Get a smart daily schedule. Mark tasks done. AI adjusts if you fall behind.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-5xl font-black gradient-text mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Loved by <span className="gradient-text">builders</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover"
              >
                <p className="text-text-secondary text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center card border-primary/20 bg-gradient-to-b from-primary/5 to-transparent"
        >
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Zap size={28} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Start achieving your goals today</h2>
          <p className="text-text-secondary mb-8">Join thousands of people using AI to turn ambitions into accomplishments.</p>
          <Link to="/signup" id="cta-final-btn">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight size={20} />}>
              Get started — it's free
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-text-muted text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span>Planora © 2026</span>
          </div>
          <p>Built with Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};
