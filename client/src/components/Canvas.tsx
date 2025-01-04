/**
 * @fileoverview Main Canvas component that combines all canvas functionality.
 * Manages drawing, templates, and user interactions.
 */

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Card } from "./ui/card";
import { CanvasProps, CanvasRef, Template, DrawingTool } from "@/types/canvas";
import { useCanvasInitialization } from "@/hooks/use-canvas-initialization";
import { useTemplateManagement } from "@/hooks/use-template-management";
import { useDrawing } from "@/hooks/use-drawing";
import { useCanvasEvents } from "@/hooks/use-canvas-events";
import { CanvasLayers } from "./CanvasLayers";
import { createCanvasDataUrl } from "@/utils/canvas-utils";
import { useUndoHistory } from "@/hooks/use-undo-history";
import { Undo } from "lucide-react";

interface CanvasProps {
    color: string;
    tool: DrawingTool;
    brushSize: number;
    selectedTemplate: TemplateType | null;
    setTool?: React.Dispatch<React.SetStateAction<DrawingTool>>;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>(
  ({ color, tool, brushSize, selectedTemplate, setTool }, ref) => {
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

    // Initialize undo history BEFORE template management
    const { addToHistory, undo, captureDrawingState, isUndoing } = useUndoHistory(
      drawingCanvasRef,
      setTemplates
    );

    // Template management hooks (moved after undo history)
    const [isOverResize, setIsOverResize] = useState(false);
    const { isOverResizeHandle, redrawTemplates, isOverDeleteButton } = useTemplateManagement({
      templateCanvasRef,
      templates,
      selectedTemplateIndex,
      tool,
      selectedTemplate,
      setTemplates,
      addToHistory,
      setSelectedTemplateIndex,
      setTool
    });

    /**
     * Safely handles template deletion
     * @param {number} index - Index of template to delete
     */
    const handleTemplateDelete = (index: number) => {
      if (index < 0 || index >= templates.length) return;
      setSelectedTemplateIndex(null);
      setTemplates(prev => prev.filter((_, i) => i !== index));
    };

    // Event handling hooks
    const { startDrawing, draw, stopDrawing } = useCanvasEvents({
      tool,
      templates,
      setTemplates,
      setSelectedTemplateIndex,
      selectedTemplateIndex,
      isOverResizeHandle,
      setIsOverResize,
      drawPoint,
      drawLine,
      getEventPosition,
      isOverDeleteButton,
      addToHistory,
      captureDrawingState,
      isUndoing
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

    /**
     * Handles keyboard events for template deletion
     */
    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (selectedTemplateIndex !== null && (e.key === 'Delete' || e.key === 'Backspace')) {
          e.preventDefault();
          if (tool === 'move') {
            handleTemplateDelete(selectedTemplateIndex);
          }
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedTemplateIndex, tool]);

    // Add keyboard shortcut for undo
    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
          e.preventDefault();
          undo();
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [undo]);

    return (
      <Card className="p-4 bg-white shadow-lg">
        <div className="relative">
          <CanvasLayers
            drawingCanvasRef={drawingCanvasRef}
            templateCanvasRef={templateCanvasRef}
            tool={tool}
            brushSize={brushSize}
            isOverResizeHandle={isOverResize}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
          />
          <button
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
            onClick={undo}
            title="Undo (Ctrl/Cmd + Z)"
          >
            <Undo className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </Card>
    );
  }
);

Canvas.displayName = "Canvas";

export default Canvas;
