/**
 * @fileoverview Component for rendering canvas layers.
 * Handles the drawing and template canvas elements.
 */

import React, { RefObject } from 'react';
import { DrawingTool } from '@/types/canvas';
import { getCanvasCursor } from '@/utils/canvas-utils';

interface CanvasLayersProps {
  drawingCanvasRef: RefObject<HTMLCanvasElement>;
  templateCanvasRef: RefObject<HTMLCanvasElement>;
  tool: DrawingTool;
  brushSize: number;
  isOverResizeHandle: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseOut: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
}

export const CanvasLayers: React.FC<CanvasLayersProps> = ({
  drawingCanvasRef,
  templateCanvasRef,
  tool,
  brushSize,
  isOverResizeHandle,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseOut,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
}) => {
  return (
    <div className="relative w-full h-[calc(100vh-16rem)] min-h-[300px] max-h-[600px] select-none">
      <canvas
        ref={drawingCanvasRef}
        className="absolute top-0 left-0 w-full h-full border border-gray-200 rounded-lg touch-none select-none"
        style={{
          cursor: getCanvasCursor(tool, brushSize, isOverResizeHandle),
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseOut={onMouseOut}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
      />
      <canvas
        ref={templateCanvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none select-none"
      />
    </div>
  );
};
