
import { toast } from "sonner";

export interface BitcoinHistoricalData {
  date: string;
  price: number;
}

export interface PredictionData {
  date: string;
  price: number;
  upperBound: number;
  lowerBound: number;
}

// Fetch Bitcoin historical price data from CoinGecko API
export const fetchBitcoinHistoricalData = async (days: number = 1825): Promise<BitcoinHistoricalData[]> => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch Bitcoin data");
    }

    const data = await response.json();
    
    // Transform the data to the format we need
    return data.prices.map((item: [number, number]) => ({
      date: new Date(item[0]).toISOString().split('T')[0],
      price: parseFloat(item[1].toFixed(2))
    }));
  } catch (error) {
    console.error("Error fetching Bitcoin data:", error);
    toast.error("Failed to fetch Bitcoin historical data. Using mock data instead.");
    return generateMockHistoricalData();
  }
};

// Generate mock historical data in case the API fails
export const generateMockHistoricalData = (): BitcoinHistoricalData[] => {
  const data: BitcoinHistoricalData[] = [];
  const startDate = new Date('2018-01-01');
  const endDate = new Date();
  
  // Generate a somewhat realistic price pattern
  let price = 15000;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Add some random fluctuation
    const randomChange = (Math.random() - 0.48) * (price * 0.05);
    price = Math.max(1000, price + randomChange);
    
    data.push({
      date: currentDate.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2))
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};
