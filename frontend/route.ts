export async function GET() {
  try {
    // Call the backend API at https://alphaforge-jg52.onrender.com
    const backendUrl = process.env.BACKEND_API_URL || 'https://alphaforge-jg52.onrender.com';
    
    const response = await fetch(`${backendUrl}/api/predictions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    });

    if (!response.ok) {
      // Return mock data if backend is unavailable
      return Response.json({
        predictions: [
          { symbol: 'BTC', price: 42350, predicted: 45230, confidence: 87 },
          { symbol: 'ETH', price: 2840, predicted: 3120, confidence: 82 },
          { symbol: 'SOL', price: 178, predicted: 195, confidence: 75 },
        ]
      });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    // Return fallback data on error
    return Response.json({
      predictions: [
        { symbol: 'BTC', price: 42350, predicted: 45230, confidence: 87 },
        { symbol: 'ETH', price: 2840, predicted: 3120, confidence: 82 },
        { symbol: 'SOL', price: 178, predicted: 195, confidence: 75 },
      ]
    });
  }
}
