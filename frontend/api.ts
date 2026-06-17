export interface APIResponse {
  symbol: string;
  prediction: 'UP' | 'DOWN';
  confidence: number;
}

export interface Prediction {
  symbol: string;
  current_price: number;
  predicted_price: number;
  change_percent: number;
  confidence: number;
  timestamp: string;
}

const mockPrices: Record<string, { current: number; change: number }> = {
  'BTC-USD': { current: 42350, change: 5.2 },
  'ETH-USD': { current: 2840, change: 3.8 },
  'SOL-USD': { current: 178, change: 8.1 },
  'BNB-USD': { current: 612, change: 2.5 },
  'XRP-USD': { current: 2.45, change: -1.3 },
  'ADA-USD': { current: 0.98, change: 2.1 },
  'DOGE-USD': { current: 0.38, change: 4.2 },
  'AVAX-USD': { current: 38.5, change: 6.7 },
  'DOT-USD': { current: 8.25, change: -0.8 },
  'LINK-USD': { current: 24.5, change: 3.4 },
};

export async function getAllPredictions(): Promise<Prediction[]> {
  try {
    const response = await fetch('https://alphaforge-jg52.onrender.com/all-predictions', {
      next: { revalidate: 30 },
    });
    if (!response.ok) throw new Error('Failed to fetch predictions');
    const data: APIResponse[] = await response.json();
    
    return data.map((item) => {
      const priceData = mockPrices[item.symbol] || { current: Math.random() * 100, change: (Math.random() - 0.5) * 10 };
      const isUp = item.prediction === 'UP';
      const changePercent = isUp ? Math.abs(priceData.change) : -Math.abs(priceData.change);
      const predictedPrice = priceData.current * (1 + changePercent / 100);
      
      return {
        symbol: item.symbol.replace('-USD', ''),
        current_price: priceData.current,
        predicted_price: Math.round(predictedPrice * 100) / 100,
        change_percent: changePercent,
        confidence: item.confidence,
        timestamp: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return [];
  }
}
