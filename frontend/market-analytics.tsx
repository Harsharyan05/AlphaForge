'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Prediction } from '@/lib/api';

interface MarketAnalyticsProps {
  predictions: Prediction[];
}

export function MarketAnalytics({ predictions }: MarketAnalyticsProps) {
  const chartData = predictions.slice(0, 8).map(p => ({
    name: p.symbol,
    current: Math.round(p.current_price * 100) / 100,
    predicted: Math.round(p.predicted_price * 100) / 100,
    confidence: p.confidence,
  }));

  const confidenceData = predictions.slice(0, 10).map(p => ({
    name: p.symbol,
    confidence: p.confidence,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-[rgba(255,255,255,0.2)] rounded-lg p-3">
          <p className="text-white text-sm font-semibold">{payload[0].payload.name}</p>
          {payload.map((entry: any, idx: number) => (
            <p key={idx} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Price Comparison Chart */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-bold mb-6">Price Comparison: Current vs Predicted</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgb(161, 161, 170)" />
            <YAxis stroke="rgb(161, 161, 170)" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="current" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
            <Bar dataKey="predicted" fill="#06B6D4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence Level Chart */}
      <div className="card-premium p-6">
        <h3 className="text-lg font-bold mb-6">Prediction Confidence Levels</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={confidenceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgb(161, 161, 170)" />
            <YAxis stroke="rgb(161, 161, 170)" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'black',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'white' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#0EA5E9"
              strokeWidth={2}
              dot={{ fill: '#0EA5E9', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card-premium p-6 space-y-2">
          <p className="text-sm text-[#A1A1AA]">Total Assets</p>
          <p className="text-3xl font-bold">{predictions.length}</p>
        </div>
        <div className="card-premium p-6 space-y-2">
          <p className="text-sm text-[#A1A1AA]">Avg Expected Change</p>
          <p className="text-3xl font-bold text-[#10B981]">
            {predictions.length > 0
              ? (
                  (predictions.reduce((sum, p) => sum + (((p.predicted_price - p.current_price) / p.current_price) * 100), 0) /
                    predictions.length)
                ).toFixed(2)
              : '0.00'}
            %
          </p>
        </div>
        <div className="card-premium p-6 space-y-2">
          <p className="text-sm text-[#A1A1AA]">Market Sentiment</p>
          <p className="text-3xl font-bold text-[#06B6D4]">
            {predictions.length > 0
              ? `${((predictions.filter(p => p.predicted_price > p.current_price).length / predictions.length) * 100).toFixed(0)}% Bullish`
              : 'Neutral'}
          </p>
        </div>
      </div>
    </div>
  );
}
