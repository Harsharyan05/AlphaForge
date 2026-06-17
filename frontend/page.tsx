'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Prediction, getAllPredictions } from '@/lib/api';
import { MarketOverview } from '@/components/dashboard/market-overview';
import { PredictionLeaderboard } from '@/components/dashboard/prediction-leaderboard';
import { InsightsCards } from '@/components/dashboard/insights-cards';
import { ConfidenceHeatmap } from '@/components/dashboard/confidence-heatmap';
import { MarketAnalytics } from '@/components/dashboard/market-analytics';
import { FeaturedSignal } from '@/components/dashboard/featured-signal';

export default function DashboardPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPredictions();
      setPredictions(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Aurora background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3), transparent 70%)' }}
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent 70%)' }}
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[rgba(255,255,255,0.08)] sticky top-0 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <div className="text-sm text-[#A1A1AA]">
            {loading ? 'Loading...' : `${predictions.length} assets tracked`}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section 1: Market Overview */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6">Market Overview</h2>
          <MarketOverview predictions={predictions} loading={loading} />
        </motion.div>

        {/* Section 2: Featured Signal */}
        <motion.div variants={itemVariants}>
          <FeaturedSignal predictions={predictions} />
        </motion.div>

        {/* Section 3: Prediction Leaderboard */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6">Prediction Leaderboard</h2>
          <PredictionLeaderboard predictions={predictions} />
        </motion.div>

        {/* Section 4: Insights Cards */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6">Key Insights</h2>
          <InsightsCards predictions={predictions} />
        </motion.div>

        {/* Section 5: Confidence Heatmap */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6">Confidence Heatmap</h2>
          <ConfidenceHeatmap predictions={predictions} />
        </motion.div>

        {/* Section 6: Market Analytics */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-6">Market Analytics</h2>
          <MarketAnalytics predictions={predictions} />
        </motion.div>
      </motion.div>
    </main>
  );
}
