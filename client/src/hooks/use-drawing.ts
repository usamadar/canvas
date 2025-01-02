/**
 * @fileoverview Hook for managing drawing operations on the canvas.
 * Provides functionality for handling drawing events, points, and lines.
 */

import { RefObject } from 'react';
import { DrawingTool } from '../types/canvas';

/**
 * Props for the useDrawing hook
 * @interface UseDrawingProps
 */
interface UseDrawingProps {
  /** Reference to the drawing canvas element */
  drawingCanvasRef: RefObject<HTMLCanvasElement>;
  /** Current selected color for drawing */
  color: string;
  /** Currently active drawing tool */
  tool: DrawingTool;
  /** Size of the brush/eraser */
  brushSize: number;
}

/**
 * Hook for managing drawing operations on the canvas
 * @param {UseDrawingProps} props - The drawing configuration props
 * @returns Drawing utility functions
 */
export const useDrawing = ({
  drawingCanvasRef,
  color,
  tool,
  brushSize,
}: UseDrawingProps) => {
  /**
   * Gets the position of a mouse or touch event relative to the canvas
   * @param {React.MouseEvent | React.TouchEvent} e - The event object
   * @returns {Object} The x and y coordinates relative to the canvas
   */
  const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left),
        y: (touch.clientY - rect.top)
      };
    } else {
      return {
        x: (e.clientX - rect.left),
        y: (e.clientY - rect.top)
      };
    }
  };

  /**
   * Draws a single point on the canvas
   * @param {Object} pos - The position to draw at
   * @param {number} pos.x - X coordinate
   * @param {number} pos.y - Y coordinate
   */
  const drawPoint = (pos: { x: number; y: number }) => {
    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.beginPath();
      ctx.fillStyle = tool === "eraser" ? "white" : color;
      ctx.arc(pos.x, pos.y, brushSize/2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  /**
   * Draws a line between two points on the canvas
   * @param {Object} startPos - Starting position
   * @param {number} startPos.x - Starting X coordinate
   * @param {number} startPos.y - Starting Y coordinate
   * @param {Object} endPos - Ending position
   * @param {number} endPos.x - Ending X coordinate
   * @param {number} endPos.y - Ending Y coordinate
   */
  const drawLine = (startPos: { x: number; y: number }, endPos: { x: number; y: number }) => {
    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = tool === "eraser" ? "white" : color;

    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.stroke();
  };

  return {
    getEventPosition,
    drawPoint,
    drawLine
  };
}; 