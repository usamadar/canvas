/**
 * @fileoverview Hook for initializing and managing canvas setup.
 * Handles canvas sizing, resolution scaling, and cleanup operations.
 */

import { RefObject, useEffect } from 'react';
import { Template } from '@/types/canvas';

/**
 * Props for the useCanvasInitialization hook
 * @interface UseCanvasInitializationProps
 */
interface UseCanvasInitializationProps {
  /** Reference to the main drawing canvas element */
  drawingCanvasRef: RefObject<HTMLCanvasElement>;
  /** Reference to the template overlay canvas element */
  templateCanvasRef: RefObject<HTMLCanvasElement>;
  /** Function to update the templates array */
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
}

/**
 * Hook for initializing and managing canvas setup
 * @param {UseCanvasInitializationProps} props - The canvas initialization configuration
 * @returns Object containing canvas utility functions
 */
export const useCanvasInitialization = ({
  drawingCanvasRef,
  templateCanvasRef,
  setTemplates,
}: UseCanvasInitializationProps) => {
  /**
   * Initializes or resizes the canvas based on container size
   * Handles DPI scaling and content preservation
   */
  const initializeCanvas = () => {
    const drawingCanvas = drawingCanvasRef.current;
    const templateCanvas = templateCanvasRef.current;
    if (!drawingCanvas || !templateCanvas) return;

    const dpr = window.devicePixelRatio || 1;
    const container = drawingCanvas.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Create temporary canvases to store current content
    const tempDrawingCanvas = document.createElement('canvas');
    const tempTemplateCanvas = document.createElement('canvas');
    
    tempDrawingCanvas.width = drawingCanvas.width;
    tempDrawingCanvas.height = drawingCanvas.height;
    tempTemplateCanvas.width = templateCanvas.width;
    tempTemplateCanvas.height = templateCanvas.height;
    
    const tempDrawingCtx = tempDrawingCanvas.getContext('2d');
    const tempTemplateCtx = tempTemplateCanvas.getContext('2d');
    
    if (tempDrawingCtx && tempTemplateCtx) {
      tempDrawingCtx.setTransform(1, 0, 0, 1, 0, 0);
      tempTemplateCtx.setTransform(1, 0, 0, 1, 0, 0);
      
      tempDrawingCtx.drawImage(drawingCanvas, 0, 0);
      tempTemplateCtx.drawImage(templateCanvas, 0, 0);
    }

    // Set new dimensions with DPI scaling
    drawingCanvas.style.width = `${containerWidth}px`;
    drawingCanvas.style.height = `${containerHeight}px`;
    drawingCanvas.width = Math.floor(containerWidth * dpr);
    drawingCanvas.height = Math.floor(containerHeight * dpr);

    templateCanvas.style.width = `${containerWidth}px`;
    templateCanvas.style.height = `${containerHeight}px`;
    templateCanvas.width = Math.floor(containerWidth * dpr);
    templateCanvas.height = Math.floor(containerHeight * dpr);

    // Initialize drawing context
    const drawingCtx = drawingCanvas.getContext('2d', { alpha: false });
    if (drawingCtx) {
      drawingCtx.setTransform(1, 0, 0, 1, 0, 0);
      drawingCtx.fillStyle = "white";
      drawingCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
      drawingCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (tempDrawingCanvas.width > 0 && tempDrawingCanvas.height > 0) {
        drawingCtx.drawImage(
          tempDrawingCanvas,
          0, 0, tempDrawingCanvas.width, tempDrawingCanvas.height,
          0, 0, containerWidth, containerHeight
        );
      }
    }

    // Initialize template context
    const templateCtx = templateCanvas.getContext('2d');
    if (templateCtx) {
      templateCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Update template positions for new dimensions
    setTemplates(prev => prev.map(template => {
      if (!template.xposition || !template.yposition) {
        return template;
      }

      const baseDimension = Math.min(containerWidth, containerHeight);
      const xRatio = template.xposition / template.size;
      const yRatio = template.yposition / template.size;
      const newSize = baseDimension * (template.size / Math.min(containerWidth, containerHeight));
      const newX = containerWidth * (template.xposition / containerWidth);
      const newY = containerHeight * (template.yposition / containerHeight);

      return {
        ...template,
        x: newX,
        y: newY,
        size: newSize,
        xposition: template.xposition,
        yposition: template.yposition
      };
    }));
  };

  /**
   * Clears both canvases and removes all templates
   */
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

  // Set up event listeners for canvas initialization and clearing
  useEffect(() => {
    initializeCanvas();
    window.addEventListener('resize', initializeCanvas);
    window.addEventListener('clearCanvas', clearCanvas);
    return () => {
      window.removeEventListener('resize', initializeCanvas);
      window.removeEventListener('clearCanvas', clearCanvas);
    };
  }, []);

  return { clearCanvas };
}; 