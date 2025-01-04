/**
 * @fileoverview Utility functions for canvas operations.
 */

import { DrawingTool } from "@/types/canvas";

/**
 * Gets the appropriate cursor style based on the current tool and brush size
 * @param {DrawingTool} tool - The current drawing tool
 * @param {number} brushSize - The size of the brush/eraser
 * @returns {string} The CSS cursor style
 */
export const getCanvasCursor = (tool: DrawingTool, brushSize: number, isOverResizeHandle = false): string => {
  if (isOverResizeHandle) return 'nwse-resize';
  if (tool === 'move') return 'move';

  // Create SVG cursor with proper size and shape
  const cursorSize = brushSize;
  const viewBoxSize = 100;
  const shape = tool === 'brush' ? 'circle' : 'rect';
  
  // For circle, we use cx, cy, r attributes
  // For rectangle, we use x, y, width, height attributes
  const shapeAttrs = shape === 'circle' 
    ? `cx="${viewBoxSize/2}" cy="${viewBoxSize/2}" r="${viewBoxSize/2 - 4}"` // Adjust radius for stroke
    : `x="4" y="4" width="${viewBoxSize - 8}" height="${viewBoxSize - 8}"`; // Adjust position and size for stroke

  // Create SVG with semi-transparent fill for better visibility
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${cursorSize}' height='${cursorSize}' viewBox='0 0 ${viewBoxSize} ${viewBoxSize}'>
      <${shape} ${shapeAttrs} fill='rgba(0,0,0,0.5)' stroke='white' stroke-width='4'/>
      <${shape} ${shapeAttrs} fill='none' stroke='black' stroke-width='2'/>
    </svg>
  `.trim();

  // Convert SVG to base64 URL-encoded string
  const encoded = encodeURIComponent(svg);
  return `url("data:image/svg+xml;utf8,${encoded}") ${cursorSize/2} ${cursorSize/2}, auto`;
};

/**
 * Creates a data URL from the combined canvas layers
 * @param {HTMLCanvasElement} drawingCanvas - The main drawing canvas
 * @param {HTMLCanvasElement} templateCanvas - The template overlay canvas
 * @returns {string} The combined canvas as a data URL
 */
export const createCanvasDataUrl = (
  drawingCanvas: HTMLCanvasElement,
  templateCanvas: HTMLCanvasElement
): string => {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return '';

  tempCanvas.width = drawingCanvas.width;
  tempCanvas.height = drawingCanvas.height;

  tempCtx.fillStyle = 'white';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  tempCtx.drawImage(drawingCanvas, 0, 0);
  tempCtx.drawImage(templateCanvas, 0, 0);

  return tempCanvas.toDataURL('image/png');
};
