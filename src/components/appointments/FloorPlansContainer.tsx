import React from 'react';
import { Grid, Download } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { Appointment } from '../../types/appointments';
import { generateFloorPlanFromMeasurements } from '../../utils/floorPlan';

interface FloorPlansContainerProps {
  appointments: Appointment[];
}

const FloorPlansContainer: React.FC<FloorPlansContainerProps> = ({ appointments }) => {
  const appointmentsWithMeasurements = appointments.filter(
    app => app.measurements && app.measurements.length > 0
  );

  const handleDownload = (floorPlanImage: string, title: string) => {
    const link = document.createElement('a');
    link.href = floorPlanImage;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-floor-plan.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (appointmentsWithMeasurements.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Floor Plans</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {appointmentsWithMeasurements.map((appointment) => {
          const floorPlanImage = generateFloorPlanFromMeasurements(appointment.measurements);
          
          return (
            <Card key={appointment.id}>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-gray-900">
                    {appointment.title}
                  </h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Download}
                    onClick={() => handleDownload(floorPlanImage, appointment.title)}
                    className="!p-2"
                  >
                    <span className="sr-only">Download</span>
                  </Button>
                </div>

                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={floorPlanImage}
                    alt={`Floor plan for ${appointment.title}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="text-sm text-gray-500">
                  <p>Total Areas: {appointment.measurements.length}</p>
                  <p>
                    Total Square Footage:{' '}
                    {appointment.measurements.reduce((total, m) => {
                      const width = parseFloat(m.width) || 0;
                      const length = parseFloat(m.length) || 0;
                      return total + (width * length);
                    }, 0).toFixed(2)}{' '}
                    sq ft
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FloorPlansContainer;