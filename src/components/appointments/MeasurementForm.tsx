import React, { useState } from 'react';
import { Plus, Minus, Calculator, Grid, Download } from 'lucide-react';
import Button from '../shared/Button';
import { Measurement } from '../../types/appointments';
import { generateFloorPlanFromMeasurements } from '../../utils/floorPlan';

interface MeasurementFormProps {
  measurements: Measurement[];
  onChange: (measurements: Measurement[]) => void;
  readOnly?: boolean;
}

const HOUSE_AREAS = [
  'Living Room',
  'Master Bedroom',
  'Bedroom 2',
  'Bedroom 3',
  'Kitchen',
  'Dining Room',
  'Bathroom 1',
  'Bathroom 2',
  'Hallway',
  'Stairs',
  'Basement',
  'Attic',
  'Office',
  'Family Room',
  'Laundry Room',
  'Garage',
  'Other'
];

const MeasurementForm: React.FC<MeasurementFormProps> = ({
  measurements = [],
  onChange,
  readOnly = false
}) => {
  const [floorPlan, setFloorPlan] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleAddMeasurement = () => {
    onChange([...measurements, { area: '', width: '', length: '', notes: '' }]);
  };

  const handleRemoveMeasurement = (index: number) => {
    onChange(measurements.filter((_, i) => i !== index));
  };

  const handleMeasurementChange = (index: number, field: keyof Measurement, value: string) => {
    const updatedMeasurements = measurements.map((measurement, i) =>
      i === index ? { ...measurement, [field]: value } : measurement
    );
    onChange(updatedMeasurements);
  };

  const calculateTotalSquareFootage = () => {
    return measurements.reduce((total, m) => {
      const width = parseFloat(m.width) || 0;
      const length = parseFloat(m.length) || 0;
      return total + (width * length);
    }, 0);
  };

  const handleGenerateFloorPlan = async () => {
    try {
      setGenerating(true);
      const floorPlanImage = generateFloorPlanFromMeasurements(measurements);
      setFloorPlan(floorPlanImage);
    } catch (error) {
      console.error('Error generating floor plan:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadFloorPlan = () => {
    if (!floorPlan) return;

    const link = document.createElement('a');
    link.href = floorPlan;
    link.download = 'floor-plan.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Measurements</h3>
        <div className="flex items-center space-x-4">
          {measurements.length > 0 && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Grid}
              onClick={handleGenerateFloorPlan}
              loading={generating}
            >
              Generate Floor Plan
            </Button>
          )}
          {!readOnly && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={handleAddMeasurement}
            >
              Add Area
            </Button>
          )}
        </div>
      </div>

      {measurements.map((measurement, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Area</label>
              {readOnly ? (
                <p className="mt-1">{measurement.area}</p>
              ) : (
                <select
                  value={measurement.area}
                  onChange={(e) => handleMeasurementChange(index, 'area', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Area</option>
                  {HOUSE_AREAS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Width (ft)</label>
              {readOnly ? (
                <p className="mt-1">{measurement.width}</p>
              ) : (
                <input
                  type="number"
                  value={measurement.width}
                  onChange={(e) => handleMeasurementChange(index, 'width', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  step="0.1"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Length (ft)</label>
              {readOnly ? (
                <p className="mt-1">{measurement.length}</p>
              ) : (
                <input
                  type="number"
                  value={measurement.length}
                  onChange={(e) => handleMeasurementChange(index, 'length', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  step="0.1"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Square Footage</label>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-gray-900">
                  {((parseFloat(measurement.width) || 0) * (parseFloat(measurement.length) || 0)).toFixed(2)} sq ft
                </span>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMeasurement(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            {readOnly ? (
              <p className="mt-1 text-gray-600">{measurement.notes}</p>
            ) : (
              <textarea
                value={measurement.notes}
                onChange={(e) => handleMeasurementChange(index, 'notes', e.target.value)}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Additional notes about this area..."
              />
            )}
          </div>
        </div>
      ))}

      {measurements.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calculator className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">Total Square Footage:</span>
            </div>
            <span className="text-lg font-bold text-indigo-600">
              {calculateTotalSquareFootage().toFixed(2)} sq ft
            </span>
          </div>
        </div>
      )}

      {/* Floor Plan Display */}
      {floorPlan && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Floor Plan</h3>
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={handleDownloadFloorPlan}
            >
              Download Floor Plan
            </Button>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <img
              src={floorPlan}
              alt="Floor Plan"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}

      {measurements.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No measurements added yet. Click "Add Area" to start.
        </p>
      )}
    </div>
  );
};

export default MeasurementForm;