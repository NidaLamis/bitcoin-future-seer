
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { RefreshCw } from "lucide-react";

interface PredictionControlsProps {
  onPredictionChange: (years: number) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const PredictionControls = ({ 
  onPredictionChange, 
  onRefresh, 
  isLoading 
}: PredictionControlsProps) => {
  const [years, setYears] = useState<number>(10);

  const handleYearsChange = (values: number[]) => {
    const newValue = values[0];
    setYears(newValue);
    onPredictionChange(newValue);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Prediction Years</label>
            <span className="text-sm font-bold">{years} years</span>
          </div>
          <Slider
            defaultValue={[10]}
            max={20}
            min={1}
            step={1}
            value={[years]}
            onValueChange={handleYearsChange}
            className="mb-6"
          />
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="w-full"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PredictionControls;
