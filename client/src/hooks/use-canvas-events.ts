/**
 * @fileoverview Hook for managing canvas event handlers.
 * Handles mouse and touch events for drawing and template manipulation.
 */

import { useState } from 'react';
import { Template, DrawingTool, ResizeHandle } from '@/types/canvas';

interface UseCanvasEventsProps {
  tool: DrawingTool;
  templates: Template[];
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  setSelectedTemplateIndex: React.Dispatch<React.SetStateAction<number | null>>;
  selectedTemplateIndex: number | null;
  isOverResizeHandle: (template: Template, pos: { x: number; y: number }) => ResizeHandle | null;
  drawPoint: (pos: { x: number; y: number }) => void;
  drawLine: (startPos: { x: number; y: number }, endPos: { x: number; y: number }) => void;
  getEventPosition: (e: React.MouseEvent | React.TouchEvent) => { x: number; y: number };
}

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
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartSize, setResizeStartSize] = useState<number>(0);
  const [resizeStartPos, setResizeStartPos] = useState<{ x: number; y: number } | null>(null);
  const [activeResizeHandle, setActiveResizeHandle] = useState<ResizeHandle | null>(null);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getEventPosition(e);

    if (tool === "move") {
      handleMoveStart(pos);
    } else {
      handleDrawStart(pos);
    }
  };

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

  const handleDrawStart = (pos: { x: number; y: number }) => {
    drawPoint(pos);
    setIsDrawing(true);
    setLastPos(pos);
  };

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

  const handleMove = (currentPos: { x: number; y: number }) => {
    if (!lastPos) return;

    if (isResizing && resizeStartPos && activeResizeHandle) {
      const dx = currentPos.x - resizeStartPos.x;
      const dy = currentPos.y - resizeStartPos.y;
      
      let sizeDelta = 0;
      switch (activeResizeHandle) {
        case 'bottom-right':
          sizeDelta = Math.max(dx, dy);
          break;
        case 'top-left':
          sizeDelta = -Math.min(dx, dy);
          break;
        case 'bottom-left':
          sizeDelta = Math.max(-dx, dy);
          break;
        case 'top-right':
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

  const handleDraw = (currentPos: { x: number; y: number }) => {
    if (!lastPos) return;
    drawLine(lastPos, currentPos);
  };

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