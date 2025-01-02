import React from "react";
import { Card } from "@/components/ui/card";
import { DrawingTool } from "@/types/canvas";

interface ColorPaletteProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  onToolChange: (tool: DrawingTool) => void;
}

const COLORS = [
  "#FF69B4", // Pink
  "#FF6B6B", // Red
  "#4ECDC4", // Turquoise
  "#45B7D1", // Blue
  "#96CEB4", // Mint
  "#FFEEAD", // Yellow
  "#D4A5A5", // Mauve
  "#9B59B6", // Purple
  "#FFB6C1", // Light Pink
  "#77DD77", // Light Green
  "#000000", // Black
  "#FFFFFF", // White
];

export default function ColorPalette({ selectedColor, onColorChange, onToolChange }: ColorPaletteProps) {
  const handleColorSelect = (color: string) => {
    onColorChange(color);
    onToolChange("brush"); // Automatically switch to brush tool when selecting a color
  };

  return (
    <Card className="p-3 sm:p-4">
      <h2 className="text-base sm:text-lg font-semibold mb-2.5 text-pink-600">Colors</h2>
      <div className="grid grid-cols-4 gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-transform hover:scale-110 relative ${
              selectedColor === color ? "ring-[6px] ring-white ring-offset-4" : ""
            }`}
            style={{ 
              backgroundColor: color,
              boxShadow: selectedColor === color ? '0 0 0 3px rgba(0,0,0,0.25)' : 'none'
            }}
            onClick={() => handleColorSelect(color)}
          />
        ))}
      </div>
    </Card>
  );
}
