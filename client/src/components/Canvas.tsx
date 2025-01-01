import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Card } from "../components/ui/card";
import { TemplateType, drawTemplate } from "../lib/templates";

interface CanvasProps {
  color: string;
  tool: "brush" | "eraser" | "move";
  brushSize: number;
  selectedTemplate: TemplateType | null;
}

interface Template {
  type: TemplateType;
  x: number;
  y: number;
  size: number;
}

interface CanvasRef {
  toDataURL: () => string;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>(
  ({ color, tool, brushSize, selectedTemplate }, ref) => {
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const templateCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);

    // Forward the drawing canvas ref for saving
    useImperativeHandle(ref, () => ({
      toDataURL: () => {
        const drawingCanvas = drawingCanvasRef.current;
        const templateCanvas = templateCanvasRef.current;
        if (!drawingCanvas || !templateCanvas) return '';

        // Create a temporary canvas
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return '';

        // Set dimensions
        tempCanvas.width = drawingCanvas.width;
        tempCanvas.height = drawingCanvas.height;

        // Draw the layers
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(drawingCanvas, 0, 0);
        tempCtx.drawImage(templateCanvas, 0, 0);

        return tempCanvas.toDataURL('image/png');
      }
    }), []);

    // Initialize canvas with correct size
    const initializeCanvas = () => {
      const drawingCanvas = drawingCanvasRef.current;
      const templateCanvas = templateCanvasRef.current;
      if (!drawingCanvas || !templateCanvas) return;

      // Get the device pixel ratio
      const dpr = window.devicePixelRatio || 1;
      const rect = drawingCanvas.getBoundingClientRect();

      // Set up drawing canvas
      drawingCanvas.style.width = `${rect.width}px`;
      drawingCanvas.style.height = `${rect.height}px`;
      drawingCanvas.width = rect.width * dpr;
      drawingCanvas.height = rect.height * dpr;

      const drawingCtx = drawingCanvas.getContext('2d', { alpha: false });
      if (drawingCtx) {
        drawingCtx.scale(dpr, dpr);
        drawingCtx.fillStyle = "white";
        drawingCtx.fillRect(0, 0, rect.width, rect.height);
      }

      // Set up template canvas with same dimensions
      templateCanvas.style.width = `${rect.width}px`;
      templateCanvas.style.height = `${rect.height}px`;
      templateCanvas.width = rect.width * dpr;
      templateCanvas.height = rect.height * dpr;

      const templateCtx = templateCanvas.getContext('2d');
      if (templateCtx) {
        templateCtx.scale(dpr, dpr);
      }
    };

    const clearCanvas = () => {
      const drawingCanvas = drawingCanvasRef.current;
      const templateCanvas = templateCanvasRef.current;
      if (!drawingCanvas || !templateCanvas) return;

      const drawingCtx = drawingCanvas.getContext('2d');
      const templateCtx = templateCanvas.getContext('2d');

      if (drawingCtx) {
        drawingCtx.fillStyle = "white";
        drawingCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
      }

      if (templateCtx) {
        templateCtx.clearRect(0, 0, templateCanvas.width, templateCanvas.height);
      }

      setTemplates([]);
    };

    useEffect(() => {
      initializeCanvas();
      window.addEventListener('resize', initializeCanvas);
      window.addEventListener('clearCanvas', clearCanvas);
      return () => {
        window.removeEventListener('resize', initializeCanvas);
        window.removeEventListener('clearCanvas', clearCanvas);
      };
    }, []);

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

    const redrawTemplates = () => {
      const canvas = templateCanvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      // Clear only the template canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw all templates
      templates.forEach((template) => {
        drawTemplate(ctx, template.type, template.x, template.y, template.size);
      });
    };

    useEffect(() => {
      if (selectedTemplate) {
        const canvas = templateCanvasRef.current;
        if (!canvas) return;
        
        // Get canvas dimensions
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Add new template to the list
        setTemplates(prev => [...prev, {
          type: selectedTemplate,
          x: centerX,
          y: centerY,
          size: 100
        }]);
        
        // Reset template selection
        setTimeout(() => {
          const event = new CustomEvent('templateDrawn');
          window.dispatchEvent(event);
        }, 100);
      }
    }, [selectedTemplate]);

    useEffect(() => {
      redrawTemplates();
    }, [templates]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const pos = getEventPosition(e);

      if (tool === "move") {
        // Check if clicked on a template
        const clickedTemplateIndex = templates.findIndex((template) => {
          const dx = template.x - pos.x;
          const dy = template.y - pos.y;
          return Math.sqrt(dx * dx + dy * dy) <= template.size;
        });

        if (clickedTemplateIndex !== -1) {
          setSelectedTemplateIndex(clickedTemplateIndex);
          setIsDrawing(true);
          setLastPos(pos);
        }
      } else {
        // Draw a dot when starting to draw
        const canvas = drawingCanvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (canvas && ctx) {
          ctx.beginPath();
          ctx.fillStyle = tool === "eraser" ? "white" : color;
          ctx.arc(pos.x, pos.y, brushSize/2, 0, Math.PI * 2);
          ctx.fill();
        }
        setIsDrawing(true);
        setLastPos(pos);
      }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing || !lastPos) return;

      const currentPos = getEventPosition(e);

      if (tool === "move" && selectedTemplateIndex !== null) {
        // Move the selected template
        const dx = currentPos.x - lastPos.x;
        const dy = currentPos.y - lastPos.y;

        setTemplates(prev => prev.map((template, index) => 
          index === selectedTemplateIndex
            ? { ...template, x: template.x + dx, y: template.y + dy }
            : template
        ));

        setLastPos(currentPos);
      } else if (tool !== "move") {
        const canvas = drawingCanvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = tool === "eraser" ? "white" : color;

        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();

        setLastPos(currentPos);
      }
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      setLastPos(null);
      setSelectedTemplateIndex(null);
    };

    return (
      <Card className="p-4 bg-white shadow-lg">
        <div className="relative w-full aspect-[4/3]">
          <canvas
            ref={drawingCanvasRef}
            className="absolute top-0 left-0 w-full h-full border border-gray-200 rounded-lg touch-none touch-action-none"
            style={{
              cursor: tool === 'move' ? 'move' :
                tool === 'brush' ? 
                  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${brushSize}' height='${brushSize}' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='black'/%3E%3C/svg%3E") ${brushSize/2} ${brushSize/2}, auto` :
                  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${brushSize}' height='${brushSize}' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='black' stroke-width='4'/%3E%3C/svg%3E") ${brushSize/2} ${brushSize/2}, auto`
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
          />
          <canvas
            ref={templateCanvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>
      </Card>
    );
  }
);

Canvas.displayName = "Canvas";

export default Canvas;
