
import { Card } from "../components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, CreditCard, Sigma } from "lucide-react";

interface PredictionStatsProps {
  stats: {
    currentPrice: number;
    predictedPrice: number;
    totalGrowth: string;
    maxPrice: string;
    minPrice: string;
    oneYearPrediction: string;
    fiveYearPrediction: string;
  } | null;
}

const PredictionStats = ({ stats }: PredictionStatsProps) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse-slow">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  const growthIsPositive = parseFloat(stats.totalGrowth) > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 flex items-center">
              <CreditCard className="h-4 w-4 mr-1" />
              Current Price
            </p>
            <h3 className="text-2xl font-bold">${stats.currentPrice.toLocaleString()}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-lg font-semibold">BTC</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Predicted Growth
          </p>
          {growthIsPositive ? (
            <div className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              {stats.totalGrowth}%
            </div>
          ) : (
            <div className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded-full flex items-center">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              {stats.totalGrowth}%
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold">${stats.predictedPrice.toLocaleString()}</h3>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500 flex items-center">
            <Sigma className="h-4 w-4 mr-1" />
            Potential Range
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Min</p>
            <p className="font-semibold">${stats.minPrice}</p>
          </div>
          <div className="h-0.5 w-12 bg-gray-300"></div>
          <div>
            <p className="text-xs text-gray-500">Max</p>
            <p className="font-semibold">${stats.maxPrice}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 md:col-span-3">
        <h3 className="font-medium text-gray-700 mb-4">Milestone Predictions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">1 Year</p>
            <p className="text-lg font-semibold">${stats.oneYearPrediction}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">5 Years</p>
            <p className="text-lg font-semibold">${stats.fiveYearPrediction}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PredictionStats;
