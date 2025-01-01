import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Card } from "../components/ui/card";
import { TemplateType, drawTemplate } from "../lib/templates";

interface CanvasProps {
  color: string;
  tool: "brush" | "eraser";
  brushSize: number;
  selectedTemplate: TemplateType | null;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ color, tool, brushSize, selectedTemplate }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

    // Forward the canvas ref
    useImperativeHandle(ref, () => canvasRef.current!, []);

    // Initialize canvas with correct size
    const initializeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Get the device pixel ratio
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // Log canvas initialization
      console.log('Initializing canvas:', {
        dpr,
        rect,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight
      });

      // Set display size (css pixels)
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Set actual size in memory (scaled for retina)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Get context and scale for retina
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      // Scale all drawing operations by dpr
      ctx.scale(dpr, dpr);

      // Set initial white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, rect.width, rect.height);

      console.log('Canvas initialized:', {
        width: canvas.width,
        height: canvas.height,
        displayWidth: rect.width,
        displayHeight: rect.height
      });
    };

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    useEffect(() => {
      initializeCanvas();
      window.addEventListener('resize', initializeCanvas);
      return () => window.removeEventListener('resize', initializeCanvas);
    }, []);

    const getEventPosition = (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
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

    useEffect(() => {
      if (selectedTemplate) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        
        // Get canvas dimensions
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Draw template in center
        drawTemplate(ctx, selectedTemplate, centerX, centerY, 100);
        
        // Reset template selection
        setTimeout(() => {
          const event = new CustomEvent('templateDrawn');
          window.dispatchEvent(event);
        }, 100);
      }
    }, [selectedTemplate]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);
      const pos = getEventPosition(e);
      setLastPos(pos);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing || !lastPos) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const currentPos = getEventPosition(e);

      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = tool === "eraser" ? "white" : color;

      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(currentPos.x, currentPos.y);
      ctx.stroke();

      setLastPos(currentPos);
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      setLastPos(null);
    };

    return (
      <Card className="p-4 bg-white shadow-lg">
        <canvas
          ref={canvasRef}
          className="w-full aspect-[4/3] border border-gray-200 rounded-lg touch-none touch-action-none"
          style={{
            cursor: tool === 'brush' ? 
              `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${brushSize}' height='${brushSize}' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='black'/%3E%3C/svg%3E") ${brushSize/2} ${brushSize/2}, auto` :
              `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${brushSize}' height='${brushSize}' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='white' stroke='black' stroke-width='2'/%3E%3C/svg%3E") ${brushSize/2} ${brushSize/2}, auto`
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
      </Card>
    );
  }
);

Canvas.displayName = "Canvas";

export default Canvas;
