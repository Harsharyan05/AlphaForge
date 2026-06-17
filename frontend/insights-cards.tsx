import { motion } from 'framer-motion';
import { TrendingUp, Zap, Activity } from 'lucide-react';
import { Prediction } from '@/lib/api';

interface InsightsCardsProps {
  predictions: Prediction[];
}

export function InsightsCards({ predictions }: InsightsCardsProps) {
  const highestConfidence = predictions.length > 0 ? Math.max(...predictions.map(p => p.confidence)) : 0;
  const avgConfidence = predictions.length > 0 ? (predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length).toFixed(1) : 0;
  const bullishCount = predictions.filter(p => p.predicted_price > p.current_price).length;
  const bullishPercent = predictions.length > 0 ? ((bullishCount / predictions.length) * 100).toFixed(1) : 0;

  const cards = [
    {
      title: 'Highest Confidence',
      value: `${highestConfidence}%`,
      description: 'Top prediction confidence score',
      icon: Zap,
      color: '#0EA5E9',
    },
    {
      title: 'Avg Confidence',
      value: `${avgConfidence}%`,
      description: 'Average across all predictions',
      icon: Activity,
      color: '#06B6D4',
    },
    {
      title: 'Bullish Signals',
      value: `${bullishPercent}%`,
      description: `${bullishCount} of ${predictions.length} assets predicted up`,
      icon: TrendingUp,
      color: '#10B981',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            className="card-premium p-6 space-y-4 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Gradient accent */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10" style={{ backgroundColor: card.color }} />

            <div className="relative z-10 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#A1A1AA] mb-1">{card.title}</p>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
                <Icon size={24} style={{ color: card.color }} />
              </div>
              <p className="text-sm text-[#A1A1AA]">{card.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
