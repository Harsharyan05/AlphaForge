import { motion } from 'framer-motion';
import { TrendingUp, Zap } from 'lucide-react';
import { Prediction } from '@/lib/api';

interface FeaturedSignalProps {
  predictions: Prediction[];
}

export function FeaturedSignal({ predictions }: FeaturedSignalProps) {
  const featured = predictions.length > 0 ? predictions[0] : null;

  if (!featured) {
    return (
      <div className="card-premium p-12 h-64 animate-pulse" />
    );
  }

  const priceChange = featured.predicted_price - featured.current_price;
  const percentChange = ((priceChange / featured.current_price) * 100).toFixed(2);

  return (
    <motion.div
      className="card-premium p-8 relative overflow-hidden border border-[#0EA5E9]/30"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9]/0 via-[#0EA5E9]/5 to-[#0EA5E9]/0 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-[#0EA5E9]" size={20} />
              <span className="text-sm text-[#A1A1AA] font-semibold">Featured Signal</span>
            </div>
            <h3 className="text-4xl font-bold">{featured.symbol}</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#A1A1AA] mb-1">Confidence Score</p>
            <p className="text-3xl font-bold text-[#0EA5E9]">{featured.confidence}%</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="text-sm text-[#A1A1AA] mb-2">Current Price</p>
            <p className="text-2xl font-bold">${featured.current_price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-sm text-[#A1A1AA] mb-2">Predicted (24h)</p>
            <p className="text-2xl font-bold">${featured.predicted_price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-sm text-[#A1A1AA] mb-2">Expected Change</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold ${parseFloat(percentChange) >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {parseFloat(percentChange) >= 0 ? '+' : ''}{percentChange}%
              </p>
              {parseFloat(percentChange) >= 0 && <TrendingUp className="text-[#10B981]" />}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A1A1AA]">Confidence Level</span>
            <span className="text-xs font-semibold text-[#0EA5E9]">{featured.confidence}%</span>
          </div>
          <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4]"
              initial={{ width: 0 }}
              animate={{ width: `${featured.confidence}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
