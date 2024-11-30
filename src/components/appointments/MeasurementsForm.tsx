import React from 'react';
import { Plus, Minus, Calculator } from 'lucide-react';
import Button from '../shared/Button';

interface Measurement {
  area: string;
  width: string;
  length: string;
  notes: string;
}

interface MeasurementsFormProps {
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

const MeasurementsForm: React.FC<MeasurementsFormProps> = ({ 
  measurements = [], 
  onChange,
  readOnly = false
}) => {
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

  // Calculate square footage for each area and total
  const { measurementsWithSqft, totalSqft } = React.useMemo(() => {
    const withSqft = measurements.map(measurement => {
      const width = parseFloat(measurement.width) || 0;
      const length = parseFloat(measurement.length) || 0;
      const sqft = width * length;
      return { ...measurement, sqft };
    });

    const total = withSqft.reduce((sum, m) => sum + m.sqft, 0);

    return { measurementsWithSqft: withSqft, totalSqft: total };
  }, [measurements]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Measurements</h3>
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

      <div className="space-y-4">
        {measurements.map((measurement, index) => {
          const width = parseFloat(measurement.width) || 0;
          const length = parseFloat(measurement.length) || 0;
          const sqft = width * length;

          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area
                  </label>
                  {readOnly ? (
                    <p className="mt-1">{measurement.area}</p>
                  ) : (
                    <select
                      value={measurement.area}
                      onChange={(e) => handleMeasurementChange(index, 'area', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select Area</option>
                      {HOUSE_AREAS.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (ft)
                  </label>
                  {readOnly ? (
                    <p className="mt-1">{measurement.width}</p>
                  ) : (
                    <input
                      type="number"
                      value={measurement.width}
                      onChange={(e) => handleMeasurementChange(index, 'width', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Width"
                      step="0.1"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Length (ft)
                  </label>
                  {readOnly ? (
                    <p className="mt-1">{measurement.length}</p>
                  ) : (
                    <input
                      type="number"
                      value={measurement.length}
                      onChange={(e) => handleMeasurementChange(index, 'length', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Length"
                      step="0.1"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Square Footage
                  </label>
                  <div className="flex items-center h-[38px] px-3 text-gray-700 bg-gray-50 rounded-md border border-gray-300">
                    {sqft.toFixed(2)} sq ft
                  </div>
                </div>

                {!readOnly && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Actions
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveMeasurement(index)}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Minus className="h-5 w-5" />
                      <span className="ml-2">Remove</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                {readOnly ? (
                  <p className="mt-1 text-gray-600">{measurement.notes}</p>
                ) : (
                  <textarea
                    value={measurement.notes}
                    onChange={(e) => handleMeasurementChange(index, 'notes', e.target.value)}
                    rows={2}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Additional notes about this area..."
                  />
                )}
              </div>
            </div>
          );
        })}

        {measurements.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No measurements added yet. Click "Add Area" to start.
          </p>
        )}

        {measurements.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-indigo-600" />
              Square Footage Summary
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                {measurementsWithSqft.map((m, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{m.area || 'Unnamed Area'}</span>
                    <span className="text-gray-900 font-medium">{m.sqft.toFixed(2)} sq ft</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-base">
                  <span className="font-semibold text-gray-900">Total Square Footage:</span>
                  <span className="font-bold text-indigo-600">{totalSqft.toFixed(2)} sq ft</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasurementsForm;