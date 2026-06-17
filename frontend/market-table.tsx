'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
}

interface MarketTableProps {
  data: MarketData[];
}

export function MarketTable({ data }: MarketTableProps) {
  return (
    <div className="card-premium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)]">
              <th className="px-6 py-4 text-left text-[#A1A1AA] font-semibold">Asset</th>
              <th className="px-6 py-4 text-right text-[#A1A1AA] font-semibold">Price</th>
              <th className="px-6 py-4 text-right text-[#A1A1AA] font-semibold">24h Change</th>
              <th className="px-6 py-4 text-right text-[#A1A1AA] font-semibold">Volume</th>
              <th className="px-6 py-4 text-right text-[#A1A1AA] font-semibold">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.symbol}
                className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.03)] transition-colors"
              >
                <td className="px-6 py-4 font-semibold">{item.symbol}</td>
                <td className="px-6 py-4 text-right">${item.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {item.change24h >= 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-[#10B981]" />
                        <span className="text-[#10B981] font-semibold">+{item.change24h.toFixed(2)}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-4 h-4 text-[#EF4444]" />
                        <span className="text-[#EF4444] font-semibold">{item.change24h.toFixed(2)}%</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-[#A1A1AA]">${(item.volume / 1e9).toFixed(2)}B</td>
                <td className="px-6 py-4 text-right text-[#A1A1AA]">${(item.marketCap / 1e9).toFixed(2)}B</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
