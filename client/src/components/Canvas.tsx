import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface CanvasProps {
  color: string;
  tool: "brush" | "eraser";
  brushSize: number;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ color, tool, brushSize }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

    // Forward the canvas ref
    useImperativeHandle(ref, () => canvasRef.current!, []);

    // Initialize canvas with correct size
    const initializeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      // Set display size
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Set actual size in memory
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Get context
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Scale all drawing operations by dpr
      ctx.scale(dpr, dpr);

      // Set initial white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, rect.width, rect.height);
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
      const dpr = window.devicePixelRatio || 1;

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
          className="w-full aspect-[4/3] border border-gray-200 rounded-lg cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
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