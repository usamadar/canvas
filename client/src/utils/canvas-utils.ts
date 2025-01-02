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
export const getCanvasCursor = (tool: DrawingTool, brushSize: number): string => {
  if (tool === 'move') return 'move';

  const shape = tool === 'brush' ? 'circle' : 'rect';
  const svgCursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${brushSize}' height='${brushSize}' viewBox='0 0 100 100'%3E%3C${shape} ${
    shape === 'circle' ? 'cx="50" cy="50" r="50"' : 'width="100" height="100"'
  } fill='black'/%3E%3C/svg%3E") ${brushSize/2} ${brushSize/2}, auto`;

  return svgCursor;
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