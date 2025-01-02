/**
 * @fileoverview Hook for managing canvas event handlers.
 * Handles mouse and touch events for drawing and template manipulation.
 */

import { useState } from 'react';
import { Template, DrawingTool, ResizeHandle } from '@/types/canvas';

/**
 * Props for the useCanvasEvents hook
 * @interface UseCanvasEventsProps
 */
interface UseCanvasEventsProps {
  /** Currently active drawing tool */
  tool: DrawingTool;
  /** Array of templates on the canvas */
  templates: Template[];
  /** Function to update templates */
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  /** Function to update selected template index */
  setSelectedTemplateIndex: React.Dispatch<React.SetStateAction<number | null>>;
  /** Index of currently selected template */
  selectedTemplateIndex: number | null;
  /** Function to check if a point is over a resize handle */
  isOverResizeHandle: (template: Template, pos: { x: number; y: number }) => ResizeHandle | null;
  /** Function to draw a single point */
  drawPoint: (pos: { x: number; y: number }) => void;
  /** Function to draw a line between two points */
  drawLine: (startPos: { x: number; y: number }, endPos: { x: number; y: number }) => void;
  /** Function to get normalized position from mouse/touch event */
  getEventPosition: (e: React.MouseEvent | React.TouchEvent) => { x: number; y: number };
}

/**
 * Hook for managing canvas drawing and template manipulation events
 * @param {UseCanvasEventsProps} props - The event handling configuration
 * @returns Object containing event handler functions
 */
export const useCanvasEvents = ({
  tool,
  templates,
  setTemplates,
  setSelectedTemplateIndex,
  selectedTemplateIndex,
  isOverResizeHandle,
  drawPoint,
  drawLine,
  getEventPosition,
}: UseCanvasEventsProps) => {
  /** Whether user is currently drawing or moving a template */
  const [isDrawing, setIsDrawing] = useState(false);
  /** Last recorded position of mouse/touch */
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  /** Whether a template is being resized */
  const [isResizing, setIsResizing] = useState(false);
  /** Initial size when starting resize operation */
  const [resizeStartSize, setResizeStartSize] = useState<number>(0);
  /** Initial position when starting resize operation */
  const [resizeStartPos, setResizeStartPos] = useState<{ x: number; y: number } | null>(null);
  /** Currently active resize handle */
  const [activeResizeHandle, setActiveResizeHandle] = useState<ResizeHandle | null>(null);

  /**
   * Handles the start of a drawing or move operation
   * @param {React.MouseEvent | React.TouchEvent} e - The triggering event
   */
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getEventPosition(e);

    if (tool === "move") {
      handleMoveStart(pos);
    } else {
      handleDrawStart(pos);
    }
  };

  /**
   * Handles the start of a template move/resize operation
   * @param {Object} pos - The current position
   */
  const handleMoveStart = (pos: { x: number; y: number }) => {
    const clickedTemplateIndex = templates.findIndex((template) => {
      const dx = template.x - pos.x;
      const dy = template.y - pos.y;
      return Math.sqrt(dx * dx + dy * dy) <= template.size;
    });

    if (clickedTemplateIndex !== -1) {
      const selectedTemplate = templates[clickedTemplateIndex];
      const resizeHandle = isOverResizeHandle(selectedTemplate, pos);
      if (resizeHandle) {
        setIsResizing(true);
        setActiveResizeHandle(resizeHandle);
        setResizeStartSize(selectedTemplate.size);
        setResizeStartPos(pos);
      }
      setSelectedTemplateIndex(clickedTemplateIndex);
      setIsDrawing(true);
      setLastPos(pos);
    } else {
      setSelectedTemplateIndex(null);
    }
  };

  /**
   * Handles the start of a drawing operation
   * @param {Object} pos - The current position
   */
  const handleDrawStart = (pos: { x: number; y: number }) => {
    drawPoint(pos);
    setIsDrawing(true);
    setLastPos(pos);
  };

  /**
   * Handles ongoing drawing or move operations
   * @param {React.MouseEvent | React.TouchEvent} e - The triggering event
   */
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !lastPos) return;

    const currentPos = getEventPosition(e);

    if (tool === "move") {
      handleMove(currentPos);
    } else {
      handleDraw(currentPos);
    }

    setLastPos(currentPos);
  };

  /**
   * Handles template movement and resizing
   * @param {Object} currentPos - The current position
   */
  const handleMove = (currentPos: { x: number; y: number }) => {
    if (!lastPos) return;

    if (isResizing && resizeStartPos && activeResizeHandle) {
      const dx = currentPos.x - resizeStartPos.x;
      const dy = currentPos.y - resizeStartPos.y;
      
      /*
      Calculate size change based on resize handle position.
      Calculate size change based on drag direction.
      We use max/min to maintain aspect ratio while resizing.
      For corners, we want consistent sizing in both directions.
      */
      let sizeDelta = 0;
      switch (activeResizeHandle) {
        case 'bottom-right':
          // For bottom-right, take larger of x/y movement for uniform scaling
          sizeDelta = Math.max(dx, dy);
          break;
        case 'top-left':
          // For top-left, take smaller of negative x/y movement
          // Negative because moving up/left should increase size
          sizeDelta = -Math.min(dx, dy);
          break;
        case 'bottom-left':
          // For bottom-left, compare negative x with positive y
          // Moving left increases width, moving down increases height
          sizeDelta = Math.max(-dx, dy);
          break;
        case 'top-right':
          // For top-right, compare positive x with negative y
          // Moving right increases width, moving up increases height
          sizeDelta = Math.max(dx, -dy);
          break;
      }

      const newSize = Math.max(20, resizeStartSize + sizeDelta * 2);
      
      setTemplates(prev => prev.map((template, index) => 
        index === selectedTemplateIndex
          ? { 
              ...template, 
              size: newSize,
              originalSize: newSize
            }
          : template
      ));
    } else {
      const dx = currentPos.x - lastPos.x;
      const dy = currentPos.y - lastPos.y;

      setTemplates(prev => prev.map((template, index) => 
        index === selectedTemplateIndex
          ? { 
              ...template, 
              x: template.x + dx, 
              y: template.y + dy,
              xposition: template.x + dx,
              yposition: template.y + dy
            }
          : template
      ));
    }
  };

  /**
   * Handles drawing lines between points
   * @param {Object} currentPos - The current position
   */
  const handleDraw = (currentPos: { x: number; y: number }) => {
    if (!lastPos) return;
    drawLine(lastPos, currentPos);
  };

  /**
   * Handles the end of drawing/moving operations
   */
  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPos(null);
    setIsResizing(false);
    setResizeStartPos(null);
    setActiveResizeHandle(null);
  };

  return {
    startDrawing,
    draw,
    stopDrawing,
    isDrawing
  };
}; 