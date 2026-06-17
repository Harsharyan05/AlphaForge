import { motion } from 'framer-motion';
import { Medal, TrendingUp } from 'lucide-react';
import { Prediction } from '@/lib/api';

interface PredictionLeaderboardProps {
  predictions: Prediction[];
}

export function PredictionLeaderboard({ predictions }: PredictionLeaderboardProps) {
  const sorted = [...predictions]
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 10);

  const getMedalColor = (index: number) => {
    if (index === 0) return 'text-yellow-400';
    if (index === 1) return 'text-gray-300';
    if (index === 2) return 'text-orange-400';
    return 'text-[#A1A1AA]';
  };

  return (
    <div className="card-premium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)]">
              <th className="px-6 py-4 text-left text-[#A1A1AA] font-semibold w-12">Rank</th>
              <th className="px-6 py-4 text-left text-[#A1A1AA] font-semibold">Asset</th>
              <th className="px-6 py-4 text-right text-[#A1A1AA] font-semibold">Confidence</th>
              <th className="px-6 py-4 text-right text-[#A1A1AA] font-semibold">Expected Return</th>
              <th className="px-6 py-4 text-right text-[#A1A1AA] font-semibold">Trend</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((coin, idx) => {
              const expectedReturn = (((coin.predicted_price - coin.current_price) / coin.current_price) * 100).toFixed(2);
              const isPositive = parseFloat(expectedReturn) >= 0;

              return (
                <motion.tr
                  key={coin.symbol}
                  className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <td className="px-6 py-4">
                    {idx < 3 ? (
                      <Medal size={18} className={getMedalColor(idx)} />
                    ) : (
                      <span className="text-[#A1A1AA] font-semibold">#{idx + 1}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold">{coin.symbol}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4]"
                          style={{ width: `${coin.confidence}%` }}
                        />
                      </div>
                      <span className="text-[#0EA5E9] font-semibold min-w-12">{coin.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-semibold ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {isPositive ? '+' : ''}{expectedReturn}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <TrendingUp size={16} className="text-[#10B981]" />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
