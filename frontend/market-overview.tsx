import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Prediction } from '@/lib/api';

interface MarketOverviewProps {
  predictions: Prediction[];
  loading: boolean;
}

export function MarketOverview({ predictions, loading }: MarketOverviewProps) {
  if (loading) {
    return <div className="card-premium p-8 h-64 animate-pulse" />;
  }

  const allCoins = predictions.slice(0, 10);

  return (
    <div className="card-premium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)]">
              <th className="px-6 py-4 text-left text-[#A1A1AA] font-semibold">Asset</th>
              <th className="px-6 py-4 text-right text-[#A1A1AA] font-semibold">Current Price</th>
              <th className="px-6 py-4 text-right text-[#A1A1AA] font-semibold">24h Change</th>
              <th className="px-6 py-4 text-right text-[#A1A1AA] font-semibold">Predicted Price</th>
              <th className="px-6 py-4 text-right text-[#A1A1AA] font-semibold">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {allCoins.map((coin, idx) => (
              <motion.tr
                key={coin.symbol}
                className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <td className="px-6 py-4 font-semibold">{coin.symbol}</td>
                <td className="px-6 py-4 text-right">${coin.current_price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {coin.change_percent >= 0 ? (
                      <>
                        <TrendingUp size={16} className="text-[#10B981]" />
                        <span className="text-[#10B981]">+{coin.change_percent.toFixed(2)}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown size={16} className="text-[#EF4444]" />
                        <span className="text-[#EF4444]">{coin.change_percent.toFixed(2)}%</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">${coin.predicted_price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0EA5E9]"
                        style={{ width: `${coin.confidence}%` }}
                      />
                    </div>
                    <span className="text-[#0EA5E9] font-semibold">{coin.confidence}%</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
