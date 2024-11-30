import React, { useState, useEffect } from 'react';
import { Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import Button from '../shared/Button';
import { Appointment } from '../../types/appointments';
import { generateFloorPlanFromMeasurements } from '../../utils/floorPlan';

interface FloorPlanModalProps {
  appointment: Appointment;
  onClose: () => void;
}

const FloorPlanModal: React.FC<FloorPlanModalProps> = ({ appointment, onClose }) => {
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Generate individual room plans
  const floorPlans = React.useMemo(() => {
    return appointment.measurements.map(room => 
      generateFloorPlanFromMeasurements([room])
    );
  }, [appointment.measurements]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setCurrentPlanIndex(prev => (prev > 0 ? prev - 1 : floorPlans.length - 1));
          break;
        case 'ArrowRight':
          setCurrentPlanIndex(prev => (prev < floorPlans.length - 1 ? prev + 1 : 0));
          break;
        case '+':
        case '=':
          setScale(prev => Math.min(prev + 0.25, 3));
          break;
        case '-':
          setScale(prev => Math.max(prev - 0.25, 0.5));
          break;
        case '0':
          setScale(1);
          setPosition({ x: 0, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [floorPlans.length, onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = floorPlans[currentPlanIndex];
    link.download = `floor-plan-${appointment.measurements[currentPlanIndex]?.area}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
  };

  const resetView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-95"
      onClick={handleClose}
    >
      {/* Header */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black bg-opacity-75"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-white">
            Floor Plan - {appointment.measurements[currentPlanIndex]?.area}
          </h3>
          <div className="text-sm text-gray-300">
            {currentPlanIndex + 1} of {floorPlans.length}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              icon={ZoomOut}
              onClick={(e) => {
                e.stopPropagation();
                setScale(prev => Math.max(0.5, prev - 0.25));
              }}
              className="!p-2"
            />
            <span className="text-white">{Math.round(scale * 100)}%</span>
            <Button
              variant="secondary"
              size="sm"
              icon={ZoomIn}
              onClick={(e) => {
                e.stopPropagation();
                setScale(prev => Math.min(3, prev + 0.25));
              }}
              className="!p-2"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleDownload}
          >
            Download
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClose}
            className="bg-gray-800 hover:bg-gray-700 text-white"
          >
            Close
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentPlanIndex(prev => (prev > 0 ? prev - 1 : floorPlans.length - 1));
        }}
        className="fixed left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-75 text-white hover:bg-opacity-90 transition-opacity focus:outline-none"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentPlanIndex(prev => (prev < floorPlans.length - 1 ? prev + 1 : 0));
        }}
        className="fixed right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-75 text-white hover:bg-opacity-90 transition-opacity focus:outline-none"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Floor Plan */}
      <div 
        className="h-full flex items-center justify-center overflow-hidden"
        onClick={e => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: scale > 1 ? 'grab' : 'default' }}
      >
        <div
          className="transition-transform duration-200"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: isDragging ? 'grabbing' : 'inherit'
          }}
        >
          <img
            src={floorPlans[currentPlanIndex]}
            alt={`Floor Plan - ${appointment.measurements[currentPlanIndex]?.area}`}
            className="max-h-[calc(100vh-120px)] max-w-[calc(100vw-120px)] object-contain"
            onDoubleClick={resetView}
            draggable={false}
          />
        </div>
      </div>

      {/* Footer */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black bg-opacity-75"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center text-white text-sm">
          <div>
            <p>Area: {appointment.measurements[currentPlanIndex]?.area}</p>
            <p>
              Square Footage:{' '}
              {(parseFloat(appointment.measurements[currentPlanIndex]?.width || '0') * 
                parseFloat(appointment.measurements[currentPlanIndex]?.length || '0')).toFixed(2)}{' '}
              sq ft
            </p>
          </div>
          <div className="text-gray-400">
            <p>Mouse wheel to zoom • Click and drag to pan • Double-click to reset</p>
            <p>Use arrow keys to navigate • Press ESC to close</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanModal;