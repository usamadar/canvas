/**
 * @fileoverview Main Canvas component that combines all canvas functionality.
 * Manages drawing, templates, and user interactions.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Card } from "./ui/card";
import { CanvasProps, CanvasRef, Template } from "@/types/canvas";
import { useCanvasInitialization } from "@/hooks/use-canvas-initialization";
import { useTemplateManagement } from "@/hooks/use-template-management";
import { useDrawing } from "@/hooks/use-drawing";
import { useCanvasEvents } from "@/hooks/use-canvas-events";
import { CanvasLayers } from "./CanvasLayers";
import { createCanvasDataUrl } from "@/utils/canvas-utils";

const Canvas = forwardRef<CanvasRef, CanvasProps>(
  ({ color, tool, brushSize, selectedTemplate }, ref) => {
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const templateCanvasRef = useRef<HTMLCanvasElement>(null);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);

    // Initialize canvas hooks
    const { clearCanvas } = useCanvasInitialization({
      drawingCanvasRef,
      templateCanvasRef,
      setTemplates,
    });

    // Drawing hooks
    const { getEventPosition, drawPoint, drawLine } = useDrawing({
      drawingCanvasRef,
      color,
      tool,
      brushSize,
    });

    // Template management hooks
    const { isOverResizeHandle, redrawTemplates } = useTemplateManagement({
      templateCanvasRef,
      templates,
      selectedTemplateIndex,
      tool,
      selectedTemplate,
      setTemplates,
    });

    // Event handling hooks
    const { startDrawing, draw, stopDrawing } = useCanvasEvents({
      tool,
      templates,
      setTemplates,
      setSelectedTemplateIndex,
      selectedTemplateIndex,
      isOverResizeHandle,
      drawPoint,
      drawLine,
      getEventPosition,
    });

    // Forward the drawing canvas ref for saving
    useImperativeHandle(ref, () => ({
      toDataURL: () => {
        const drawingCanvas = drawingCanvasRef.current;
        const templateCanvas = templateCanvasRef.current;
        if (!drawingCanvas || !templateCanvas) return '';
        return createCanvasDataUrl(drawingCanvas, templateCanvas);
      }
    }), []);

    // Clear selection when switching away from move tool
    useEffect(() => {
      if (tool !== "move") {
        setSelectedTemplateIndex(null);
        redrawTemplates();
      }
    }, [tool]);

    return (
      <Card className="p-4 bg-white shadow-lg">
        <CanvasLayers
          drawingCanvasRef={drawingCanvasRef}
          templateCanvasRef={templateCanvasRef}
          tool={tool}
          brushSize={brushSize}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </Card>
    );
  }
);

Canvas.displayName = "Canvas";

export default Canvas;
