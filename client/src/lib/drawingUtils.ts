// Canvas utility functions for drawing operations

/**
 * Clear the canvas with a white background
 */
export function clearCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draw a line between two points
 */
export function drawLine(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string,
  width: number
) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.closePath();
}

/**
 * Get the position of a mouse or touch event relative to the canvas
 */
export function getRelativeEventPosition(
  event: MouseEvent | TouchEvent,
  canvas: HTMLCanvasElement
) {
  const rect = canvas.getBoundingClientRect();
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
  
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

/**
 * Load and draw an image onto the canvas
 */
export function loadImageToCanvas(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  options: {
    scale?: number;
    preserveAspectRatio?: boolean;
    centerImage?: boolean;
  } = {}
): Promise<void> {
  const {
    scale = 1,
    preserveAspectRatio = true,
    centerImage = true
  } = options;
  
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Clear canvas first
      clearCanvas(canvas);
      
      let drawWidth = img.width * scale;
      let drawHeight = img.height * scale;
      
      if (preserveAspectRatio) {
        const scaleFactor = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        ) * scale;
        
        drawWidth = img.width * scaleFactor;
        drawHeight = img.height * scaleFactor;
      }
      
      let x = 0;
      let y = 0;
      
      if (centerImage) {
        x = (canvas.width - drawWidth) / 2;
        y = (canvas.height - drawHeight) / 2;
      }
      
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      resolve();
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Save the canvas content as a PNG file
 */
export function saveCanvasAsPNG(canvas: HTMLCanvasElement, filename: string): void {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error saving canvas:', error);
    throw error;
  }
}

/**
 * Get the current state of the canvas as an ImageData object
 */
export function getCanvasState(canvas: HTMLCanvasElement): ImageData | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Restore a previously saved canvas state
 */
export function restoreCanvasState(
  canvas: HTMLCanvasElement,
  imageData: ImageData
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.putImageData(imageData, 0, 0);
}

/**
 * Apply an eraser effect at the specified position
 */
export function eraseAt(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}

/**
 * Create a smooth curve between points for better drawing
 */
export function smoothLine(
  ctx: CanvasRenderingContext2D,
  points: Array<{ x: number; y: number }>,
  color: string,
  width: number
) {
  if (points.length < 2) return;
  
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Move to the first point
  ctx.moveTo(points[0].x, points[0].y);
  
  // Create a smooth curve through all points
  for (let i = 1; i < points.length - 2; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }
  
  // Curve through the last two points
  if (points.length > 2) {
    const last = points.length - 1;
    ctx.quadraticCurveTo(
      points[last - 1].x,
      points[last - 1].y,
      points[last].x,
      points[last].y
    );
  }
  
  ctx.stroke();
  ctx.closePath();
}
