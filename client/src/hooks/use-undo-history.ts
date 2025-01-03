/**
 * @fileoverview Hook for managing undo history for canvas operations
 */

import { useState, useCallback } from 'react';
import { Template, UndoAction } from '@/types/canvas';

/** Maximum number of operations to store in undo history */
const MAX_UNDO_STACK = 50;

/**
 * Hook for managing undo history
 */
export const useUndoHistory = (
  drawingCanvasRef: React.RefObject<HTMLCanvasElement>,
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>
) => {
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [isUndoing, setIsUndoing] = useState(false);

  /**
   * Adds an action to the undo stack with size limit enforcement
   */
  const addToHistory = useCallback((action: UndoAction) => {
    setUndoStack(prev => {
      // If we've reached the limit, remove oldest action
      if (prev.length >= MAX_UNDO_STACK) {
        return [...prev.slice(1), action];
      }
      return [...prev, action];
    });
  }, []);

  /**
   * Safely cleans up state after undo operation
   */
  const cleanupState = useCallback(() => {
    setIsUndoing(false);
  }, []);

  /**
   * Handles the undo operation with safety checks
   */
  const undo = useCallback(() => {
    if (isUndoing || undoStack.length === 0) return;
    setIsUndoing(true);

    try {
      const lastAction = undoStack[undoStack.length - 1];
      const canvas = drawingCanvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx) {
        console.warn('Canvas context not available');
        return;
      }

      switch (lastAction.type) {
        case 'ADD_TEMPLATE':
          setTemplates(prev => prev.filter((_, i) => i !== lastAction.index));
          break;

        case 'DELETE_TEMPLATE':
          setTemplates(prev => {
            const newTemplates = [...prev];
            newTemplates.splice(lastAction.index, 0, lastAction.template);
            return newTemplates;
          });
          break;

        case 'MOVE_TEMPLATE':
        case 'RESIZE_TEMPLATE':
          setTemplates(prev => 
            prev.map(template => 
              template.id === lastAction.template.id ? lastAction.previousTemplate : template
            )
          );
          break;

        case 'DRAW':
          ctx.putImageData(lastAction.imageData, 0, 0);
          break;

        default:
          console.warn('Unknown action type in undo stack');
          return;
      }

      setUndoStack(prev => prev.slice(0, -1));
    } catch (error) {
      console.error('Error during undo operation:', error);
    } finally {
      cleanupState();
    }
  }, [undoStack, drawingCanvasRef, setTemplates, isUndoing, cleanupState]);

  /**
   * Captures the current canvas state before drawing
   */
  const captureDrawingState = useCallback(() => {
    if (isUndoing) return; // Don't capture during undo

    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      addToHistory({ type: 'DRAW', imageData });
    } catch (error) {
      console.error('Error capturing drawing state:', error);
    }
  }, [drawingCanvasRef, addToHistory, isUndoing]);

  return {
    addToHistory,
    undo,
    captureDrawingState,
    isUndoing
  };
}; 