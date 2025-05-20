
import { useEffect, useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  ComposedChart
} from "recharts";
import { BitcoinHistoricalData, PredictionData } from "../services/bitcoinService";
import { useIsMobile } from "../hooks/use-mobile";

interface PriceChartProps {
  historicalData: BitcoinHistoricalData[];
  predictionData: PredictionData[];
  isLoading: boolean;
}

const PriceChart = ({ historicalData, predictionData, isLoading }: PriceChartProps) => {
  const [combinedData, setCombinedData] = useState<Array<any>>([]);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (historicalData.length && predictionData.length) {
      // Combine historical and prediction data for display
      const combined = [
        ...historicalData.map(item => ({
          date: item.date,
          historicalPrice: item.price,
        })),
        ...predictionData.map(item => ({
          date: item.date,
          predictedPrice: item.price,
          upperBound: item.upperBound,
          lowerBound: item.lowerBound
        }))
      ];
      
      setCombinedData(combined);
    }
  }, [historicalData, predictionData]);
  
  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };
  
  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-md shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {data.historicalPrice !== undefined && (
            <p className="text-chart-line">
              Price: {formatTooltipValue(data.historicalPrice)}
            </p>
          )}
          {data.predictedPrice !== undefined && (
            <>
              <p className="text-chart-prediction">
                Predicted: {formatTooltipValue(data.predictedPrice)}
              </p>
              <p className="text-gray-500 text-sm">
                Range: {formatTooltipValue(data.lowerBound)} - {formatTooltipValue(data.upperBound)}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };
  
  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading price data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Bitcoin Price Prediction</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={combinedData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value) => {
                if (isMobile) {
                  return value.split('-')[0];
                }
                return value;
              }} 
              angle={-45} 
              textAnchor="end"
              interval={isMobile ? 365 : 182}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              domain={['auto', 'auto']} 
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip content={customTooltip} />
            <Legend verticalAlign="top" height={36} />
            <Line 
              type="monotone" 
              dataKey="historicalPrice" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false} 
              name="Historical Price" 
            />
            <Line 
              type="monotone" 
              dataKey="predictedPrice" 
              stroke="#10b981" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              dot={false} 
              name="Predicted Price" 
            />
            <Area 
              type="monotone" 
              dataKey="upperBound" 
              stackId="1" 
              stroke="none" 
              fill="#d1fae5" 
              name="Upper Confidence" 
            />
            <Area 
              type="monotone" 
              dataKey="lowerBound" 
              stackId="2" 
              stroke="none" 
              fill="#d1fae5" 
              name="Lower Confidence" 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-gray-500 mt-4 italic">
        Note: This is a simplified prediction model. Actual prices may vary significantly.
      </div>
    </div>
  );
};

export default PriceChart;
