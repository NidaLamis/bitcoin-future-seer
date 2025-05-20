
import { BitcoinHistoricalData, PredictionData } from "../services/bitcoinService";

interface LinearRegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
}

// Simple linear regression implementation
const linearRegression = (xValues: number[], yValues: number[]): LinearRegressionResult => {
  const n = xValues.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for (let i = 0; i < n; i++) {
    sumX += xValues[i];
    sumY += yValues[i];
    sumXY += xValues[i] * yValues[i];
    sumXX += xValues[i] * xValues[i];
    sumYY += yValues[i] * yValues[i];
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calculate R-squared
  const yMean = sumY / n;
  let totalVariation = 0;
  let explainedVariation = 0;
  
  for (let i = 0; i < n; i++) {
    totalVariation += Math.pow(yValues[i] - yMean, 2);
    explainedVariation += Math.pow(slope * xValues[i] + intercept - yMean, 2);
  }
  
  const rSquared = explainedVariation / totalVariation;
  
  return { slope, intercept, rSquared };
};

// Moving average function
const calculateMovingAverage = (data: number[], window: number): number[] => {
  const result = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(data[i]);
    } else {
      const windowSlice = data.slice(i - window + 1, i + 1);
      const avg = windowSlice.reduce((sum, val) => sum + val, 0) / window;
      result.push(avg);
    }
  }
  
  return result;
};

export const generatePredictions = (
  historicalData: BitcoinHistoricalData[],
  yearsToPredict: number = 10
): PredictionData[] => {
  // Prepare data for regression
  const timestamps: number[] = [];
  const prices: number[] = [];
  
  historicalData.forEach((dataPoint, index) => {
    timestamps.push(index);
    prices.push(dataPoint.price);
  });
  
  // Smooth the data using a moving average
  const smoothedPrices = calculateMovingAverage(prices, 30);
  
  // Apply logarithmic transformation for better fit with exponential growth patterns
  const logPrices = smoothedPrices.map(price => Math.log(price));
  
  // Perform linear regression on the log-transformed data
  const regression = linearRegression(timestamps, logPrices);
  
  // Generate future predictions
  const predictionDays = yearsToPredict * 365;
  const predictions: PredictionData[] = [];
  
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  const volatility = calculateVolatility(prices);
  
  for (let i = 1; i <= predictionDays; i++) {
    const futureTimestamp = timestamps.length - 1 + i;
    const logPrediction = regression.slope * futureTimestamp + regression.intercept;
    const pricePrediction = Math.exp(logPrediction);
    
    // Add confidence intervals based on historical volatility
    const daysSinceStart = i;
    const confidenceInterval = volatility * Math.sqrt(daysSinceStart) * pricePrediction;
    
    const predictionDate = new Date(lastDate);
    predictionDate.setDate(lastDate.getDate() + i);
    
    predictions.push({
      date: predictionDate.toISOString().split('T')[0],
      price: parseFloat(pricePrediction.toFixed(2)),
      upperBound: parseFloat((pricePrediction + confidenceInterval).toFixed(2)),
      lowerBound: parseFloat(Math.max(0, pricePrediction - confidenceInterval).toFixed(2))
    });
  }
  
  return predictions;
};

// Calculate historical volatility
const calculateVolatility = (prices: number[]): number => {
  if (prices.length < 2) return 0.1; // Default value
  
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i - 1]));
  }
  
  const meanReturn = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const squaredDifferences = returns.map(ret => Math.pow(ret - meanReturn, 2));
  const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / returns.length;
  
  return Math.sqrt(variance);
};

export const calculatePredictionStats = (predictions: PredictionData[]) => {
  if (!predictions.length) return null;
  
  const firstPrice = predictions[0].price;
  const lastPrice = predictions[predictions.length - 1].price;
  const growthRate = (lastPrice / firstPrice - 1) * 100;
  
  const maxPrice = Math.max(...predictions.map(p => p.upperBound));
  const minPrice = Math.min(...predictions.map(p => p.lowerBound));
  
  const oneYearIndex = Math.min(364, predictions.length - 1);
  const fiveYearIndex = Math.min(5 * 365 - 1, predictions.length - 1);
  
  return {
    currentPrice: firstPrice,
    predictedPrice: lastPrice,
    totalGrowth: growthRate.toFixed(2),
    maxPrice: maxPrice.toFixed(2),
    minPrice: minPrice.toFixed(2),
    oneYearPrediction: predictions[oneYearIndex].price.toFixed(2),
    fiveYearPrediction: predictions[fiveYearIndex].price.toFixed(2),
  };
};
