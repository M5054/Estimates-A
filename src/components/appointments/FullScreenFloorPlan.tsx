import React, { useState, useEffect, useCallback } from 'react';
import { Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import Button from '../shared/Button';
import { Measurement } from '../../types/appointments';

interface FullScreenFloorPlanProps {
  floorPlans: string[];
  measurements: Measurement[];
  initialIndex: number;
  onClose: () => void;
}

const FullScreenFloorPlan: React.FC<FullScreenFloorPlanProps> = ({
  floorPlans,
  measurements,
  initialIndex,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'ArrowLeft':
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : floorPlans.length - 1));
        break;
      case 'ArrowRight':
        setCurrentIndex(prev => (prev < floorPlans.length - 1 ? prev + 1 : 0));
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
  }, [floorPlans.length, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = floorPlans[currentIndex];
    link.download = `floor-plan-${currentIndex + 1}.png`;
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

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Prevent scrolling of the background when modal is open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

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
            Floor Plan {currentIndex === 0 ? '(Full View)' : `(${measurements[currentIndex - 1]?.area})`}
          </h3>
          <div className="text-sm text-gray-300">
            {currentIndex + 1} of {floorPlans.length}
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
          setCurrentIndex(prev => (prev > 0 ? prev - 1 : floorPlans.length - 1));
        }}
        className="fixed left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-75 text-white hover:bg-opacity-90 transition-opacity focus:outline-none"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex(prev => (prev < floorPlans.length - 1 ? prev + 1 : 0));
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
            src={floorPlans[currentIndex]}
            alt="Floor Plan"
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
            <p>Total Areas: {measurements.length}</p>
            <p>
              Total Square Footage:{' '}
              {measurements.reduce((total, m) => {
                const width = parseFloat(m.width) || 0;
                const length = parseFloat(m.length) || 0;
                return total + (width * length);
              }, 0).toFixed(2)}{' '}
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

export default FullScreenFloorPlan;