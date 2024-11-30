import React, { useState } from 'react';
import { Ruler, Grid, Download, ChevronLeft, ChevronRight, Maximize2, LayoutGrid } from 'lucide-react';
import Button from '../shared/Button';
import { Measurement } from '../../types/appointments';
import { generateFloorPlanFromMeasurements } from '../../utils/floorPlan';
import FullScreenFloorPlan from './FullScreenFloorPlan';

interface MeasurementDisplayProps {
  measurements: Measurement[];
}

const MeasurementDisplay: React.FC<MeasurementDisplayProps> = ({ measurements }) => {
  const [floorPlans, setFloorPlans] = useState<string[]>([]);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showCombinedView, setShowCombinedView] = useState(false);

  const calculateTotalSquareFootage = (measurements: Measurement[]) => {
    return measurements.reduce((total, m) => {
      const width = parseFloat(m.width) || 0;
      const length = parseFloat(m.length) || 0;
      return total + (width * length);
    }, 0);
  };

  const handleGenerateFloorPlan = async () => {
    try {
      setGenerating(true);
      // Generate individual room plans
      const roomPlans = measurements.map(room => 
        generateFloorPlanFromMeasurements([room])
      );
      // Generate combined floor plan
      const fullPlan = generateFloorPlanFromMeasurements(measurements);
      
      setFloorPlans([...roomPlans, fullPlan]);
      setCurrentPlanIndex(0);
    } catch (error) {
      console.error('Error generating floor plan:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadFloorPlan = () => {
    if (!floorPlans[currentPlanIndex]) return;

    const link = document.createElement('a');
    link.href = floorPlans[currentPlanIndex];
    const planName = showCombinedView ? 'combined-floor-plan' : `floor-plan-${measurements[currentPlanIndex]?.area}`;
    link.download = `${planName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviousPlan = () => {
    if (showCombinedView) {
      setShowCombinedView(false);
      setCurrentPlanIndex(floorPlans.length - 2);
    } else {
      setCurrentPlanIndex(prev => 
        prev > 0 ? prev - 1 : floorPlans.length - 2
      );
    }
  };

  const handleNextPlan = () => {
    if (currentPlanIndex === floorPlans.length - 2) {
      setShowCombinedView(true);
      setCurrentPlanIndex(floorPlans.length - 1);
    } else {
      setCurrentPlanIndex(prev => prev + 1);
    }
  };

  const getCurrentPlanTitle = () => {
    if (showCombinedView) {
      return 'Combined View';
    }
    return measurements[currentPlanIndex]?.area || '';
  };

  if (!measurements || measurements.length === 0) return null;

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Measurements</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Total Area: {calculateTotalSquareFootage(measurements).toFixed(2)} sq ft
          </div>
          {floorPlans.length === 0 ? (
            <Button
              variant="secondary"
              size="sm"
              icon={Grid}
              onClick={handleGenerateFloorPlan}
              loading={generating}
            >
              Generate Floor Plans
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                icon={LayoutGrid}
                onClick={() => {
                  setShowCombinedView(!showCombinedView);
                  setCurrentPlanIndex(showCombinedView ? 0 : floorPlans.length - 1);
                }}
              >
                {showCombinedView ? 'Show Individual' : 'Show Combined'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Maximize2}
                onClick={() => setShowFullScreen(true)}
              >
                Full Screen
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Measurements List */}
      <div className="space-y-4 mb-6">
        {measurements.map((measurement, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Area</label>
                <p className="mt-1 text-gray-900">{measurement.area}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Dimensions</label>
                <p className="mt-1 text-gray-900">
                  {measurement.width}' × {measurement.length}'
                  <span className="ml-2 text-gray-500">
                    ({(parseFloat(measurement.width) * parseFloat(measurement.length)).toFixed(2)} sq ft)
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  <Ruler className="h-4 w-4 inline-block mr-1" />
                  Square Footage
                </label>
                <p className="mt-1 text-gray-900 font-medium">
                  {(parseFloat(measurement.width) * parseFloat(measurement.length)).toFixed(2)} sq ft
                </p>
              </div>
            </div>
            {measurement.notes && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-500">Notes</label>
                <p className="mt-1 text-gray-600 whitespace-pre-wrap">{measurement.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floor Plans Display */}
      {floorPlans.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Floor Plan - {getCurrentPlanTitle()}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={handlePreviousPlan}
                  className="!p-2"
                >
                  <span className="sr-only">Previous</span>
                </Button>
                <span className="text-sm text-gray-500">
                  {showCombinedView ? 'Combined' : `${currentPlanIndex + 1} of ${floorPlans.length - 1}`}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ChevronRight}
                  onClick={handleNextPlan}
                  className="!p-2"
                >
                  <span className="sr-only">Next</span>
                </Button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={handleDownloadFloorPlan}
              >
                Download
              </Button>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={floorPlans[currentPlanIndex]}
                alt={`Floor Plan - ${getCurrentPlanTitle()}`}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Modal */}
      {showFullScreen && (
        <FullScreenFloorPlan
          floorPlans={floorPlans}
          measurements={measurements}
          initialIndex={currentPlanIndex}
          onClose={() => setShowFullScreen(false)}
        />
      )}
    </div>
  );
};

export default MeasurementDisplay;