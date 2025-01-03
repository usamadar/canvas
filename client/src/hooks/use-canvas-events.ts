/**
 * @fileoverview Hook for managing canvas event handlers.
 * Handles mouse and touch events for drawing and template manipulation.
 */

import { useState } from 'react';
import { Template, DrawingTool, ResizeHandle, UndoAction } from '@/types/canvas';

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
  /** Function to check if a point is over a delete button */
  isOverDeleteButton: (template: Template, pos: { x: number; y: number }) => boolean;
  addToHistory: (action: UndoAction) => void;
  captureDrawingState: () => void;
  isUndoing: boolean;
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
  isOverDeleteButton,
  addToHistory,
  captureDrawingState,
  isUndoing
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
  /** Whether user clicked on delete button */
  const [isOverDelete, setIsOverDelete] = useState(false);
  /** Store initial template state for batch operations */
  const [moveStartTemplate, setMoveStartTemplate] = useState<Template | null>(null);
  const [resizeStartTemplate, setResizeStartTemplate] = useState<Template | null>(null);

  /**
   * Safely handles template deletion
   * @param {number} index - Index of template to delete
   */
  const handleTemplateDelete = (index: number) => {
    if (index < 0 || index >= templates.length) return;
    
    const deletedTemplate = templates[index];
    addToHistory({
      type: 'DELETE_TEMPLATE',
      template: deletedTemplate,
      index
    });

    setSelectedTemplateIndex(null);
    setTemplates(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Safely handles template operations with edge case checks
   * @param {number} index - Template index to operate on
   * @returns {Template | null} The template if valid, null otherwise
   */
  const getValidTemplate = (index: number): Template | null => {
    if (index === null || index < 0 || index >= templates.length) {
      return null;
    }
    return templates[index];
  };

  /**
   * Checks if any operation is in progress
   */
  const isOperationInProgress = (): boolean => {
    return isUndoing || isDrawing || isResizing;
  };

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
    if (isOperationInProgress()) return;

    const clickedTemplateIndex = templates.findIndex((template) => {
      const dx = template.x - pos.x;
      const dy = template.y - pos.y;
      return Math.sqrt(dx * dx + dy * dy) <= template.size;
    });

    const clickedTemplate = getValidTemplate(clickedTemplateIndex);
    if (!clickedTemplate) {
      setSelectedTemplateIndex(null);
      return;
    }

    // Check if clicking delete button
    if (isOverDeleteButton(clickedTemplate, pos)) {
      setIsOverDelete(true);
      handleTemplateDelete(clickedTemplateIndex);
      return;
    }

    const resizeHandle = isOverResizeHandle(clickedTemplate, pos);
    if (resizeHandle) {
      setIsResizing(true);
      setActiveResizeHandle(resizeHandle);
      setResizeStartSize(clickedTemplate.size);
      setResizeStartPos(pos);
      setResizeStartTemplate(clickedTemplate);
    } else {
      setMoveStartTemplate(clickedTemplate);
    }
    
    setSelectedTemplateIndex(clickedTemplateIndex);
    setIsDrawing(true);
    setLastPos(pos);
  };

  /**
   * Handles the start of a drawing operation
   * @param {Object} pos - The current position
   */
  const handleDrawStart = (pos: { x: number; y: number }) => {
    captureDrawingState(); // Capture state before drawing
    drawPoint(pos);
    setIsDrawing(true);
    setLastPos(pos);
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
   * Handles ongoing drawing or move operations
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
   * Handles template movement and resizing with safety checks
   */
  const handleMove = (currentPos: { x: number; y: number }) => {
    if (!lastPos || selectedTemplateIndex === null) return;

    const selectedTemplate = getValidTemplate(selectedTemplateIndex);
    if (!selectedTemplate) {
      stopDrawing();
      return;
    }

    if (isResizing && resizeStartPos && activeResizeHandle && resizeStartTemplate) {
      handleResize(currentPos, selectedTemplate);
    } else if (moveStartTemplate) {
      handleMoveTemplate(currentPos, selectedTemplate);
    }
  };

  /**
   * Handles template resizing
   */
  const handleResize = (currentPos: { x: number; y: number }, template: Template) => {
    if (!resizeStartPos || !activeResizeHandle) return;

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
    
    setTemplates(prev => prev.map(t => 
      t.id === template.id
        ? { ...t, size: newSize, originalSize: newSize }
        : t
    ));
  };

  /**
   * Handles template movement
   */
  const handleMoveTemplate = (currentPos: { x: number; y: number }, template: Template) => {
    if (!lastPos) return;

    const dx = currentPos.x - lastPos.x;
    const dy = currentPos.y - lastPos.y;

    setTemplates(prev => prev.map(t => 
      t.id === template.id
        ? { 
            ...t, 
            x: t.x + dx,
            y: t.y + dy,
            xposition: t.x + dx,
            yposition: t.y + dy
          }
        : t
    ));
  };

  /**
   * Handles the end of drawing/moving operations with cleanup
   */
  const stopDrawing = () => {
    if (selectedTemplateIndex !== null) {
      const currentTemplate = getValidTemplate(selectedTemplateIndex);
      
      if (currentTemplate) {
        if (isResizing && resizeStartTemplate) {
          addToHistory({
            type: 'RESIZE_TEMPLATE',
            template: currentTemplate,
            previousTemplate: resizeStartTemplate
          });
        } else if (moveStartTemplate) {
          addToHistory({
            type: 'MOVE_TEMPLATE',
            template: currentTemplate,
            previousTemplate: moveStartTemplate
          });
        }
      }
    }

    // Reset all state
    setIsDrawing(false);
    setLastPos(null);
    setIsResizing(false);
    setResizeStartPos(null);
    setActiveResizeHandle(null);
    setMoveStartTemplate(null);
    setResizeStartTemplate(null);
    setIsOverDelete(false);
  };

  return {
    startDrawing,
    draw,
    stopDrawing,
    isDrawing
  };
}; 