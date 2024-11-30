import { Measurement } from '../types/appointments';

export const generateFloorPlanFromMeasurements = (measurements: Measurement[]): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Calculate total dimensions and scale
  const maxWidth = Math.max(...measurements.map(m => parseFloat(m.width) || 0));
  const maxLength = Math.max(...measurements.map(m => parseFloat(m.length) || 0));
  const totalArea = measurements.reduce((sum, m) => {
    return sum + ((parseFloat(m.width) || 0) * (parseFloat(m.length) || 0));
  }, 0);

  // Set canvas size with padding
  const scale = 40; // pixels per foot
  const padding = 60; // padding for labels
  canvas.width = maxWidth * scale + padding * 2;
  canvas.height = maxLength * scale + padding * 2;

  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;

  // Vertical grid lines
  for (let x = 0; x <= maxWidth; x++) {
    ctx.beginPath();
    ctx.moveTo(x * scale + padding, padding);
    ctx.lineTo(x * scale + padding, maxLength * scale + padding);
    ctx.stroke();
  }

  // Horizontal grid lines
  for (let y = 0; y <= maxLength; y++) {
    ctx.beginPath();
    ctx.moveTo(padding, y * scale + padding);
    ctx.lineTo(maxWidth * scale + padding, y * scale + padding);
    ctx.stroke();
  }

  // Draw rooms
  let currentY = padding;
  measurements.forEach((room, index) => {
    const width = parseFloat(room.width) || 0;
    const length = parseFloat(room.length) || 0;
    const area = width * length;

    // Draw room rectangle
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(padding, currentY, width * scale, length * scale);

    // Fill room with light color
    ctx.fillStyle = `hsla(${(index * 60) % 360}, 70%, 95%, 0.5)`;
    ctx.fillRect(padding, currentY, width * scale, length * scale);

    // Add room label
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${room.area} (${area.toFixed(2)} sq ft)`,
      padding + (width * scale) / 2,
      currentY + length * scale / 2
    );

    // Add dimensions
    ctx.font = '14px sans-serif';
    // Width
    ctx.fillText(
      `${width} ft`,
      padding + (width * scale) / 2,
      currentY - 10
    );
    // Length
    ctx.save();
    ctx.translate(padding - 10, currentY + (length * scale) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${length} ft`, 0, 0);
    ctx.restore();

    currentY += length * scale + 20;
  });

  // Add total area
  ctx.fillStyle = '#4f46e5';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    `Total Area: ${totalArea.toFixed(2)} sq ft`,
    canvas.width / 2,
    canvas.height - padding / 2
  );

  return canvas.toDataURL('image/png');
};