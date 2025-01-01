import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Pencil, Eraser } from "lucide-react";

interface DrawingToolsProps {
  selectedTool: "brush" | "eraser";
  onToolChange: (tool: "brush" | "eraser") => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
}

export default function DrawingTools({
  selectedTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
}: DrawingToolsProps) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-3 text-pink-600">Tools</h2>
      
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
            selectedTool === "brush"
              ? "bg-pink-100 border-pink-400"
              : "border-transparent hover:bg-gray-100"
          }`}
          onClick={() => onToolChange("brush")}
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
        >
          <Eraser className="w-6 h-6 mx-auto" />
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
    </Card>
  );
}
