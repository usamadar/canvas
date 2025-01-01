import React from "react";
import { Card } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Pencil, Eraser, Star, Heart, Flower2, Trash2, Move } from "lucide-react";
import { TemplateType } from "../lib/templates";

interface DrawingToolsProps {
  selectedTool: "brush" | "eraser" | "move";
  onToolChange: (tool: "brush" | "eraser" | "move") => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  selectedTemplate: TemplateType | null;
  onSelectTemplate: (template: TemplateType | null) => void;
  onClearCanvas: () => void;
}

export default function DrawingTools({
  selectedTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  selectedTemplate,
  onSelectTemplate,
  onClearCanvas,
}: DrawingToolsProps) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-3 text-pink-600">Tools</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
              selectedTool === "brush"
                ? "bg-pink-100 border-pink-400"
                : "border-transparent hover:bg-gray-100"
            }`}
            onClick={() => onToolChange("brush")}
            aria-label="Brush tool"
          >
            <Pencil className="w-6 h-6 mx-auto" />
          </button>
          
          <button
            className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
              selectedTool === "eraser"
                ? "bg-pink-100 border-pink-400"
                : "border-transparent hover:bg-gray-100"
            }`}
            onClick={() => onToolChange("eraser")}
            aria-label="Eraser tool"
          >
            <Eraser className="w-6 h-6 mx-auto" />
          </button>

          <button
            className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
              selectedTool === "move"
                ? "bg-pink-100 border-pink-400"
                : "border-transparent hover:bg-gray-100"
            }`}
            onClick={() => onToolChange("move")}
            aria-label="Move tool"
          >
            <Move className="w-6 h-6 mx-auto" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Brush Size</label>
          <Slider
            min={1}
            max={20}
            step={1}
            value={[brushSize]}
            onValueChange={(value) => onBrushSizeChange(value[0])}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">Templates</label>
          <div className="flex gap-2">
            <button
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                selectedTemplate === "star"
                  ? "bg-pink-100 border-pink-400"
                  : "border-transparent hover:bg-gray-100"
              }`}
              onClick={() => onSelectTemplate(selectedTemplate === "star" ? null : "star")}
              aria-label="Star template"
            >
              <Star className="w-6 h-6 mx-auto" />
            </button>
            <button
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                selectedTemplate === "heart"
                  ? "bg-pink-100 border-pink-400"
                  : "border-transparent hover:bg-gray-100"
              }`}
              onClick={() => onSelectTemplate(selectedTemplate === "heart" ? null : "heart")}
              aria-label="Heart template"
            >
              <Heart className="w-6 h-6 mx-auto" />
            </button>
            <button
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                selectedTemplate === "flower"
                  ? "bg-pink-100 border-pink-400"
                  : "border-transparent hover:bg-gray-100"
              }`}
              onClick={() => onSelectTemplate(selectedTemplate === "flower" ? null : "flower")}
              aria-label="Flower template"
            >
              <Flower2 className="w-6 h-6 mx-auto" />
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            className="flex items-center justify-center w-full gap-2 p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100"
            onClick={onClearCanvas}
            aria-label="Clear canvas"
          >
            <Trash2 className="w-4 h-4" />
            Clear Canvas
          </button>
        </div>
      </div>
    </Card>
  );
}
