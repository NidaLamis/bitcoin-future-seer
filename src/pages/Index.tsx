
import { useEffect, useState } from "react";
import Header from "../components/Header";
import PriceChart from "../components/PriceChart";
import PredictionControls from "../components/PredictionControls";
import PredictionStats from "../components/PredictionStats";
import {
  BitcoinHistoricalData,
  PredictionData,
  fetchBitcoinHistoricalData,
} from "../services/bitcoinService";
import { calculatePredictionStats, generatePredictions } from "../lib/ml";
import { toast } from "sonner";

const Index = () => {
  const [historicalData, setHistoricalData] = useState<BitcoinHistoricalData[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);
  const [predictionYears, setPredictionYears] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<any>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBitcoinHistoricalData();
      setHistoricalData(data);
      
      // Generate predictions
      const predictions = generatePredictions(data, predictionYears);
      setPredictionData(predictions);
      
      // Calculate stats
      const predictionStats = calculatePredictionStats(predictions);
      setStats(predictionStats);
      
      toast.success("Bitcoin data loaded successfully!");
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (historicalData.length > 0) {
      const predictions = generatePredictions(historicalData, predictionYears);
      setPredictionData(predictions);
      
      const predictionStats = calculatePredictionStats(predictions);
      setStats(predictionStats);
    }
  }, [historicalData, predictionYears]);
  
  const handlePredictionYearsChange = (years: number) => {
    setPredictionYears(years);
  };
  
  const handleRefreshData = () => {
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <PredictionControls 
              onPredictionChange={handlePredictionYearsChange}
              onRefresh={handleRefreshData}
              isLoading={isLoading}
            />
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium mb-2">About This Model</h3>
              <p className="text-sm text-gray-600 mb-4">
                This prediction uses historical Bitcoin price data and applies a machine learning
                model to forecast potential future prices.
              </p>
              <div className="text-xs text-gray-500">
                <p>• Uses logarithmic regression</p>
                <p>• Incorporates volatility modeling</p>
                <p>• Shows confidence intervals</p>
                <p className="mt-4 italic">
                  Remember: All predictions are speculative and not financial advice.
                </p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <PredictionStats stats={stats} />
            <PriceChart 
              historicalData={historicalData}
              predictionData={predictionData}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
