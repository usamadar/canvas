/**
 * @fileoverview Hook for managing template operations on the canvas.
 * Handles template drawing, resizing, and positioning functionality.
 */

import { RefObject, useEffect } from 'react';
import { Template, DrawingTool, ResizeHandle } from '../types/canvas';
import { TemplateType, drawTemplate } from '../lib/templates';

/** Size of the resize handles in pixels */
const RESIZE_HANDLE_SIZE = 10;

/**
 * Props for the useTemplateManagement hook
 * @interface UseTemplateManagementProps
 */
interface UseTemplateManagementProps {
  /** Reference to the template canvas element */
  templateCanvasRef: RefObject<HTMLCanvasElement>;
  /** Array of current templates on the canvas */
  templates: Template[];
  /** Index of the currently selected template */
  selectedTemplateIndex: number | null;
  /** Currently active drawing tool */
  tool: DrawingTool;
  /** Currently selected template type for new templates */
  selectedTemplate: TemplateType | null;
  /** Function to update the templates array */
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
}

/**
 * Hook for managing template operations on the canvas
 * @param {UseTemplateManagementProps} props - The template management configuration
 * @returns Template management utility functions
 */
export const useTemplateManagement = ({
  templateCanvasRef,
  templates,
  selectedTemplateIndex,
  tool,
  selectedTemplate,
  setTemplates,
}: UseTemplateManagementProps) => {
  /**
   * Draws resize handles around a selected template
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {Template} template - The template to draw handles for
   */
  const drawResizeHandles = (ctx: CanvasRenderingContext2D, template: Template) => {
    if (selectedTemplateIndex === null || tool !== "move") return;

    ctx.strokeStyle = "#00a8ff";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
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

    ctx.fillStyle = "white";
    ctx.strokeStyle = "#00a8ff";
    ctx.lineWidth = 2;

    const handlePositions = [
      { x: template.x - halfSize - RESIZE_HANDLE_SIZE, y: template.y - halfSize - RESIZE_HANDLE_SIZE },
      { x: template.x + halfSize, y: template.y - halfSize - RESIZE_HANDLE_SIZE },
      { x: template.x - halfSize - RESIZE_HANDLE_SIZE, y: template.y + halfSize },
      { x: template.x + halfSize, y: template.y + halfSize }
    ];

    handlePositions.forEach(pos => {
      ctx.beginPath();
      ctx.rect(pos.x, pos.y, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
      ctx.fill();
      ctx.stroke();
    });
  };

  /**
   * Redraws all templates on the canvas
   */
  const redrawTemplates = () => {
    const canvas = templateCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    templates.forEach((template, index) => {
      drawTemplate(ctx, template.type, template.x, template.y, template.size);
      if (index === selectedTemplateIndex) {
        drawResizeHandles(ctx, template);
      }
    });
  };

  /**
   * Effect to handle adding new templates to the canvas
   */
  useEffect(() => {
    if (selectedTemplate) {
      const canvas = templateCanvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;
      
      const baseDimension = Math.min(containerWidth, containerHeight);
      let templateSize = baseDimension * 0.4;
      
      switch (selectedTemplate) {
        case "cat": templateSize = baseDimension * 0.5; break;
        case "heart": templateSize = baseDimension * 0.35; break;
        case "star":
        case "arrow": templateSize = baseDimension * 0.3; break;
        case "cloud":
        case "flower":
        case "heartEyes": templateSize = baseDimension * 0.4; break;
      }
      
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      setTemplates(prev => [...prev, {
        type: selectedTemplate,
        x: centerX,
        y: centerY,
        size: templateSize,
        xposition: centerX,
        yposition: centerY,
        originalSize: templateSize
      }]);
      
      setTimeout(() => {
        const event = new CustomEvent('templateDrawn');
        window.dispatchEvent(event);
      }, 100);
    }
  }, [selectedTemplate]);

  /**
   * Effect to redraw templates when necessary
   */
  useEffect(() => {
    redrawTemplates();
  }, [templates, tool, selectedTemplateIndex]);

  return {
    /**
     * Checks if a point is over a template's resize handle
     * @param {Template} template - The template to check
     * @param {Object} pos - The position to check
     * @returns {ResizeHandle | null} Whether the position is over a resize handle
     */
    isOverResizeHandle: (template: Template, pos: { x: number; y: number }): ResizeHandle | null => {
      const handleSize = 10; // Size of resize handle hitbox
      const dx = pos.x - template.x;
      const dy = pos.y - template.y;
      const radius = template.size / 2;

      // Check each corner
      if (Math.abs(dx - radius) <= handleSize && Math.abs(dy - radius) <= handleSize) {
        return 'bottom-right';
      }
      if (Math.abs(dx + radius) <= handleSize && Math.abs(dy + radius) <= handleSize) {
        return 'top-left';
      }
      if (Math.abs(dx + radius) <= handleSize && Math.abs(dy - radius) <= handleSize) {
        return 'bottom-left';
      }
      if (Math.abs(dx - radius) <= handleSize && Math.abs(dy + radius) <= handleSize) {
        return 'top-right';
      }

      return null;
    },
    redrawTemplates
  };
}; 