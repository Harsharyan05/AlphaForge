'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface PredictionCardProps {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: 'up' | 'down';
  color: 'purple' | 'pink' | 'cyan';
}

const colorMap = {
  purple: { text: '#7C3AED', barGradient: 'from-[#7C3AED] to-[#6D28D9]' },
  pink: { text: '#EC4899', barGradient: 'from-[#EC4899] to-[#BE185D]' },
  cyan: { text: '#06B6D4', barGradient: 'from-[#06B6D4] to-[#0891B2]' },
};

export function PredictionCard({
  symbol,
  currentPrice,
  predictedPrice,
  confidence,
  trend,
  color,
}: PredictionCardProps) {
  const colors = colorMap[color];
  const priceChange = predictedPrice - currentPrice;
  const percentChange = ((priceChange / currentPrice) * 100).toFixed(2);

  return (
    <div className="card-premium p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">{symbol}</h3>
          <p className="text-sm text-[#A1A1AA]">Prediction</p>
        </div>
        {trend === 'up' ? (
          <TrendingUp className="w-5 h-5" style={{ color: colors.text }} />
        ) : (
          <TrendingDown className="w-5 h-5" style={{ color: colors.text }} />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-[#A1A1AA] mb-1">Current Price</p>
          <p className="text-2xl font-bold">${currentPrice.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-[#A1A1AA] mb-1">Predicted (24h)</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">${predictedPrice.toLocaleString()}</p>
            <p className={`text-sm font-semibold ${priceChange >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {priceChange >= 0 ? '+' : ''}{percentChange}%
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[#A1A1AA]">Confidence</p>
          <p className="text-sm font-bold" style={{ color: colors.text }}>{confidence}%</p>
        </div>
        <div className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${colors.barGradient}`}
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
