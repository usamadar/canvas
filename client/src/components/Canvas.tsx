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
  originalX?: number;  // Store original positions and size
  originalY?: number;
  originalSize?: number;
}

interface CanvasRef {
  toDataURL: () => string;
}

const RESIZE_HANDLE_SIZE = 10;

const Canvas = forwardRef<CanvasRef, CanvasProps>(
  ({ color, tool, brushSize, selectedTemplate }, ref) => {
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const templateCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStartSize, setResizeStartSize] = useState<number>(0);
    const [resizeStartPos, setResizeStartPos] = useState<{ x: number; y: number } | null>(null);

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

      // Get the container size
      const container = drawingCanvas.parentElement;
      if (!container) return;

      // Calculate dimensions maintaining aspect ratio
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Store the current canvas content before resizing
      const tempDrawingCanvas = document.createElement('canvas');
      const tempTemplateCanvas = document.createElement('canvas');
      
      // Set temp canvases to current canvas size
      tempDrawingCanvas.width = drawingCanvas.width;
      tempDrawingCanvas.height = drawingCanvas.height;
      tempTemplateCanvas.width = templateCanvas.width;
      tempTemplateCanvas.height = templateCanvas.height;
      
      const tempDrawingCtx = tempDrawingCanvas.getContext('2d');
      const tempTemplateCtx = tempTemplateCanvas.getContext('2d');
      
      if (tempDrawingCtx && tempTemplateCtx) {
        // Save the current transforms
        tempDrawingCtx.setTransform(1, 0, 0, 1, 0, 0);
        tempTemplateCtx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Copy the entire canvas state
        tempDrawingCtx.drawImage(drawingCanvas, 0, 0);
        tempTemplateCtx.drawImage(templateCanvas, 0, 0);
      }

      // Set new canvas dimensions
      drawingCanvas.style.width = `${containerWidth}px`;
      drawingCanvas.style.height = `${containerHeight}px`;
      drawingCanvas.width = Math.floor(containerWidth * dpr);
      drawingCanvas.height = Math.floor(containerHeight * dpr);

      templateCanvas.style.width = `${containerWidth}px`;
      templateCanvas.style.height = `${containerHeight}px`;
      templateCanvas.width = Math.floor(containerWidth * dpr);
      templateCanvas.height = Math.floor(containerHeight * dpr);

      // Set up drawing context
      const drawingCtx = drawingCanvas.getContext('2d', { alpha: false });
      if (drawingCtx) {
        // Reset transform and fill with white
        drawingCtx.setTransform(1, 0, 0, 1, 0, 0);
        drawingCtx.fillStyle = "white";
        drawingCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);

        // Apply device pixel ratio scale
        drawingCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Only restore if we had previous content
        if (tempDrawingCanvas.width > 0 && tempDrawingCanvas.height > 0) {
          drawingCtx.drawImage(
            tempDrawingCanvas,
            0, 0, tempDrawingCanvas.width, tempDrawingCanvas.height,
            0, 0, containerWidth, containerHeight
          );
        }
      }

      // Set up template context
      const templateCtx = templateCanvas.getContext('2d');
      if (templateCtx) {
        templateCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      // Update template positions based on new container size
      setTemplates(prev => prev.map(template => {
        if (!template.originalSize || !template.originalX || !template.originalY) {
          return template;
        }

        // Calculate the base dimension for the new size
        const baseDimension = Math.min(containerWidth, containerHeight);
        
        // Calculate position ratios relative to container dimensions
        const xRatio = template.originalX / template.originalSize;
        const yRatio = template.originalY / template.originalSize;
        
        // Calculate new size based on current container
        const newSize = baseDimension * (template.originalSize / Math.min(containerWidth, containerHeight));
        
        // Calculate new positions maintaining relative position
        const newX = containerWidth * (template.originalX / containerWidth);
        const newY = containerHeight * (template.originalY / containerHeight);

        return {
          ...template,
          x: newX,
          y: newY,
          size: newSize,
          originalX: template.originalX,
          originalY: template.originalY,
          originalSize: template.originalSize
        };
      }));
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

    const drawResizeHandles = (ctx: CanvasRenderingContext2D, template: Template) => {
      if (selectedTemplateIndex === null || tool !== "move") return;

      // Draw selection rectangle
      ctx.strokeStyle = "#00a8ff";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      // Draw selection rectangle around the template
      const halfSize = template.size / 2;
      ctx.beginPath();
      ctx.rect(
        template.x - halfSize - 5,
        template.y - halfSize - 5,
        template.size + 10,
        template.size + 10
      );
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw resize handles at corners
      ctx.fillStyle = "white";
      ctx.strokeStyle = "#00a8ff";
      ctx.lineWidth = 2;

      // Top-left handle
      ctx.beginPath();
      ctx.rect(
        template.x - halfSize - RESIZE_HANDLE_SIZE,
        template.y - halfSize - RESIZE_HANDLE_SIZE,
        RESIZE_HANDLE_SIZE,
        RESIZE_HANDLE_SIZE
      );
      ctx.fill();
      ctx.stroke();

      // Top-right handle
      ctx.beginPath();
      ctx.rect(
        template.x + halfSize,
        template.y - halfSize - RESIZE_HANDLE_SIZE,
        RESIZE_HANDLE_SIZE,
        RESIZE_HANDLE_SIZE
      );
      ctx.fill();
      ctx.stroke();

      // Bottom-left handle
      ctx.beginPath();
      ctx.rect(
        template.x - halfSize - RESIZE_HANDLE_SIZE,
        template.y + halfSize,
        RESIZE_HANDLE_SIZE,
        RESIZE_HANDLE_SIZE
      );
      ctx.fill();
      ctx.stroke();

      // Bottom-right handle
      ctx.beginPath();
      ctx.rect(
        template.x + halfSize,
        template.y + halfSize,
        RESIZE_HANDLE_SIZE,
        RESIZE_HANDLE_SIZE
      );
      ctx.fill();
      ctx.stroke();
    };

    const isOverResizeHandle = (template: Template, pos: { x: number; y: number }) => {
      const halfSize = template.size / 2;
      const handles = [
        // Top-left
        { x: template.x - halfSize - RESIZE_HANDLE_SIZE/2, y: template.y - halfSize - RESIZE_HANDLE_SIZE/2 },
        // Top-right
        { x: template.x + halfSize + RESIZE_HANDLE_SIZE/2, y: template.y - halfSize - RESIZE_HANDLE_SIZE/2 },
        // Bottom-left
        { x: template.x - halfSize - RESIZE_HANDLE_SIZE/2, y: template.y + halfSize + RESIZE_HANDLE_SIZE/2 },
        // Bottom-right
        { x: template.x + halfSize + RESIZE_HANDLE_SIZE/2, y: template.y + halfSize + RESIZE_HANDLE_SIZE/2 }
      ];

      return handles.some(handle => 
        Math.abs(pos.x - handle.x) <= RESIZE_HANDLE_SIZE &&
        Math.abs(pos.y - handle.y) <= RESIZE_HANDLE_SIZE
      );
    };

    const redrawTemplates = () => {
      const canvas = templateCanvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      // Clear only the template canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw all templates
      templates.forEach((template, index) => {
        drawTemplate(ctx, template.type, template.x, template.y, template.size);
        if (index === selectedTemplateIndex) {
          drawResizeHandles(ctx, template);
        }
      });
    };

    useEffect(() => {
      if (selectedTemplate) {
        const canvas = templateCanvasRef.current;
        if (!canvas) return;
        
        // Get canvas dimensions (using CSS dimensions for consistent sizing)
        const rect = canvas.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        
        // Calculate base size relative to the smaller dimension
        const baseDimension = Math.min(containerWidth, containerHeight);
        let templateSize = baseDimension * 0.4;  // Default 40% of smaller dimension
        
        // Adjust size for specific templates that might need different scaling
        switch (selectedTemplate) {
          case "cat":
            templateSize = baseDimension * 0.5;  // Cat at 50%
            break;
          case "heart":
            templateSize = baseDimension * 0.35;  // Heart slightly smaller
            break;
          case "star":
          case "arrow":
            templateSize = baseDimension * 0.3;  // Smaller for compact shapes
            break;
          case "cloud":
          case "flower":
          case "heartEyes":
            templateSize = baseDimension * 0.4;  // 40% for medium-sized templates
            break;
        }
        
        const centerX = containerWidth / 2;
        const centerY = containerHeight / 2;
        
        // Add new template to the list with original positions and size
        setTemplates(prev => [...prev, {
          type: selectedTemplate,
          x: centerX,
          y: centerY,
          size: templateSize,
          originalX: centerX,
          originalY: centerY,
          originalSize: templateSize
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
    }, [templates, tool, selectedTemplateIndex]);

    // Clear selection when switching away from move tool
    useEffect(() => {
      if (tool !== "move") {
        setSelectedTemplateIndex(null);
        redrawTemplates(); // Force immediate redraw
      }
    }, [tool]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const pos = getEventPosition(e);

      if (tool === "move") {
        // Check if clicked on resize handle first
        if (selectedTemplateIndex !== null) {
          const selectedTemplate = templates[selectedTemplateIndex];
          if (isOverResizeHandle(selectedTemplate, pos)) {
            setIsResizing(true);
            setResizeStartSize(selectedTemplate.size);
            setResizeStartPos(pos);
            setIsDrawing(true);
            setLastPos(pos);
            return;
          }
        }

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
        } else {
          setSelectedTemplateIndex(null);
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
        if (isResizing && resizeStartPos) {
          // Calculate size change based on diagonal drag
          const dx = currentPos.x - resizeStartPos.x;
          const dy = currentPos.y - resizeStartPos.y;
          const sizeDelta = Math.max(dx, dy);
          
          setTemplates(prev => prev.map((template, index) => 
            index === selectedTemplateIndex
              ? { ...template, size: Math.max(20, resizeStartSize + sizeDelta * 2) }
              : template
          ));
        } else {
          // Move the selected template
          const dx = currentPos.x - lastPos.x;
          const dy = currentPos.y - lastPos.y;

          setTemplates(prev => prev.map((template, index) => 
            index === selectedTemplateIndex
              ? { ...template, x: template.x + dx, y: template.y + dy }
              : template
          ));
        }
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
      setIsResizing(false);
      setResizeStartPos(null);
    };

    return (
      <Card className="p-4 bg-white shadow-lg">
        <div className="relative w-full h-[calc(100vh-16rem)] min-h-[300px] max-h-[600px]">
          <canvas
            ref={drawingCanvasRef}
            className="absolute top-0 left-0 w-full h-full border border-gray-200 rounded-lg touch-none"
            style={{
              cursor: tool === 'move' ? 'move' :
                tool === 'brush' ? 
                  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${brushSize}' height='${brushSize}' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='black'/%3E%3C/svg%3E") ${brushSize/2} ${brushSize/2}, auto` :
                  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${brushSize}' height='${brushSize}' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='black'/%3E%3C/svg%3E") ${brushSize/2} ${brushSize/2}, auto`
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
