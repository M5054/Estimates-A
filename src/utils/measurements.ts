import { Measurement } from '../types/appointments';

export const calculateSquareFootage = (width: string, length: string): number => {
  const w = parseFloat(width) || 0;
  const l = parseFloat(length) || 0;
  return w * l;
};

export const calculateTotalSquareFootage = (measurements: Measurement[]): number => {
  return measurements.reduce((total, m) => {
    return total + calculateSquareFootage(m.width, m.length);
  }, 0);
};

export const formatSquareFootage = (sqft: number): string => {
  return `${sqft.toFixed(2)} sq ft`;
};

export const parseMeasurements = (measurements: string | Measurement[]): Measurement[] => {
  if (typeof measurements === 'string') {
    try {
      return JSON.parse(measurements);
    } catch (error) {
      console.error('Error parsing measurements:', error);
      return [];
    }
  }
  return measurements || [];
};