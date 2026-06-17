import { motion } from 'framer-motion';
import { Prediction } from '@/lib/api';

interface ConfidenceHeatmapProps {
  predictions: Prediction[];
}

export function ConfidenceHeatmap({ predictions }: ConfidenceHeatmapProps) {
  const sorted = [...predictions].sort((a, b) => b.confidence - a.confidence).slice(0, 10);

  const getHeatmapColor = (confidence: number) => {
    if (confidence >= 90) return { bg: 'bg-[#10B981]/30', border: 'border-[#10B981]' };
    if (confidence >= 80) return { bg: 'bg-[#0EA5E9]/30', border: 'border-[#0EA5E9]' };
    if (confidence >= 70) return { bg: 'bg-[#06B6D4]/30', border: 'border-[#06B6D4]' };
    return { bg: 'bg-[#A1A1AA]/10', border: 'border-[#A1A1AA]' };
  };

  return (
    <div className="card-premium p-8">
      <div className="space-y-6">
        {/* Legend */}
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#10B981]/30 border border-[#10B981]" />
            <span className="text-[#A1A1AA]">90%+</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#0EA5E9]/30 border border-[#0EA5E9]" />
            <span className="text-[#A1A1AA]">80-89%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#06B6D4]/30 border border-[#06B6D4]" />
            <span className="text-[#A1A1AA]">70-79%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#A1A1AA]/10 border border-[#A1A1AA]" />
            <span className="text-[#A1A1AA]">Below 70%</span>
          </div>
        </div>

        {/* Heatmap grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {sorted.map((coin, idx) => {
            const colors = getHeatmapColor(coin.confidence);
            return (
              <motion.div
                key={coin.symbol}
                className={`${colors.bg} border ${colors.border} rounded-lg p-4 text-center space-y-2 cursor-pointer transition-all hover:scale-105`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.1 }}
              >
                <p className="font-semibold">{coin.symbol}</p>
                <div>
                  <p className="text-2xl font-bold">{coin.confidence}%</p>
                  <p className="text-xs text-[#A1A1AA]">confidence</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
          <div>
            <p className="text-sm text-[#A1A1AA] mb-2">Strongest Signal</p>
            <p className="text-lg font-bold">
              {sorted.length > 0 ? `${sorted[0].symbol} (${sorted[0].confidence}%)` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#A1A1AA] mb-2">Median Confidence</p>
            <p className="text-lg font-bold">
              {sorted.length > 0 ? `${sorted[Math.floor(sorted.length / 2)].confidence}%` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#A1A1AA] mb-2">High Confidence (80%+)</p>
            <p className="text-lg font-bold">
              {sorted.filter(p => p.confidence >= 80).length} / {sorted.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
