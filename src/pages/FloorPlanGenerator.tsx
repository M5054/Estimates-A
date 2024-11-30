import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAppointments } from '../lib/api/appointments';
import { Grid, Download, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import FullScreenFloorPlan from '../components/appointments/FullScreenFloorPlan';
import { generateFloorPlanFromMeasurements } from '../utils/floorPlan';
import type { Appointment, Measurement } from '../types/appointments';

interface ClientFloorPlans {
  clientName: string;
  companyName: string;
  appointments: Appointment[];
}

interface FloorPlan {
  id: string;
  title: string;
  area: string;
  width: string;
  length: string;
  image: string;
  appointment: Appointment;
  measurement: Measurement;
}

const FloorPlanGenerator: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientFloorPlans, setClientFloorPlans] = useState<ClientFloorPlans[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [floorPlans, setFloorPlans] = useState<string[]>([]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const appointments = await getAppointments(user.id);
      
      // Filter appointments with measurements and group by client
      const appointmentsWithMeasurements = appointments.filter(
        app => app.measurements && app.measurements.length > 0
      );

      const groupedByClient = appointmentsWithMeasurements.reduce((acc, appointment) => {
        const clientId = appointment.client.id;
        if (!acc[clientId]) {
          acc[clientId] = {
            clientName: appointment.client.name,
            companyName: appointment.client.company,
            appointments: []
          };
        }
        acc[clientId].appointments.push(appointment);
        return acc;
      }, {} as Record<string, ClientFloorPlans>);

      setClientFloorPlans(Object.values(groupedByClient));
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load floor plans');
    } finally {
      setLoading(false);
    }
  };

  const getFloorPlansForClient = (appointments: Appointment[]): FloorPlan[] => {
    return appointments.flatMap(appointment => 
      appointment.measurements.map((measurement, index) => ({
        id: `${appointment.id}-${index}`,
        title: appointment.title,
        area: measurement.area,
        width: measurement.width,
        length: measurement.length,
        image: generateFloorPlanFromMeasurements([measurement]),
        appointment,
        measurement
      }))
    );
  };

  const handlePlanClick = (appointment: Appointment, measurementIndex: number) => {
    const roomPlans = appointment.measurements.map(room => 
      generateFloorPlanFromMeasurements([room])
    );
    
    setSelectedAppointment(appointment);
    setFloorPlans(roomPlans);
    setSelectedPlanIndex(measurementIndex);
  };

  const handleDownload = (floorPlanImage: string, title: string, area: string) => {
    const link = document.createElement('a');
    link.href = floorPlanImage;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${area.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateTotalArea = (appointments: Appointment[]) => {
    return appointments.reduce((total, appointment) => {
      return total + appointment.measurements.reduce((areaTotal, measurement) => {
        const width = parseFloat(measurement.width) || 0;
        const length = parseFloat(measurement.length) || 0;
        return areaTotal + (width * length);
      }, 0);
    }, 0);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Floor Plans by Client</h1>

      {clientFloorPlans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Grid className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No floor plans available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add measurements to your appointments to generate floor plans.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {clientFloorPlans.map(({ clientName, companyName, appointments }) => {
            const isExpanded = expandedClient === `${companyName}-${clientName}`;
            const totalArea = calculateTotalArea(appointments);
            const floorPlans = getFloorPlansForClient(appointments);

            return (
              <Card key={`${companyName}-${clientName}`}>
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedClient(
                    isExpanded ? null : `${companyName}-${clientName}`
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">{companyName}</h2>
                        <p className="text-sm text-gray-500">{clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{floorPlans.length} Floor Plans</p>
                        <p className="text-sm text-gray-500">{totalArea.toFixed(2)} sq ft total</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200">
                    <div className="p-6">
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {floorPlans.map((plan) => (
                          <div 
                            key={plan.id}
                            className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all"
                            onClick={() => handlePlanClick(
                              plan.appointment,
                              plan.appointment.measurements.indexOf(plan.measurement)
                            )}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">
                                  {plan.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {plan.area}
                                </p>
                              </div>
                              <Button
                                variant="secondary"
                                size="sm"
                                icon={Download}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(plan.image, plan.title, plan.area);
                                }}
                                className="!p-2"
                              >
                                <span className="sr-only">Download</span>
                              </Button>
                            </div>

                            <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden mb-4">
                              <img
                                src={plan.image}
                                alt={`Floor plan for ${plan.title} - ${plan.area}`}
                                className="w-full h-full object-contain"
                              />
                            </div>

                            <div className="text-sm text-gray-500">
                              <p>
                                Dimensions: {plan.width}' × {plan.length}'
                              </p>
                              <p>
                                Area:{' '}
                                {(parseFloat(plan.width) * parseFloat(plan.length)).toFixed(2)}{' '}
                                sq ft
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Full Screen Floor Plan Modal */}
      {selectedAppointment && floorPlans.length > 0 && (
        <FullScreenFloorPlan
          floorPlans={floorPlans}
          measurements={selectedAppointment.measurements}
          initialIndex={selectedPlanIndex}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

export default FloorPlanGenerator;