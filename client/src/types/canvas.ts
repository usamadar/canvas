/**
 * @fileoverview Type definitions for the canvas drawing application.
 * Contains interfaces and types for canvas properties, templates, and drawing tools.
 */

import { TemplateType } from "../lib/templates";

/**
 * Represents a drawable template on the canvas
 * @interface Template
 */
export interface Template {
  /** The type of template to draw */
  type: TemplateType;
  /** X-coordinate position of the template */
  x: number;
  /** Y-coordinate position of the template */
  y: number;
  /** Size of the template */
  size: number;
  /** Original X position for resize calculations */
  originalX?: number;
  /** Original Y position for resize calculations */
  originalY?: number;
  /** Original size for resize calculations */
  originalSize?: number;
}

/**
 * Canvas reference interface for external control
 * @interface CanvasRef
 */
export interface CanvasRef {
  /** Converts the current canvas state to a data URL */
  toDataURL: () => string;
}

/**
 * Available drawing tools in the application
 * @typedef {("brush" | "eraser" | "move")} DrawingTool
 */
export type DrawingTool = "brush" | "eraser" | "move";

/**
 * Props for the Canvas component
 * @interface CanvasProps
 */
export interface CanvasProps {
  /** Current selected color for drawing */
  color: string;
  /** Currently active drawing tool */
  tool: DrawingTool;
  /** Size of the brush/eraser */
  brushSize: number;
  /** Currently selected template, if any */
  selectedTemplate: TemplateType | null;
} 