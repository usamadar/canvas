import React from "react";
import { Card } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Pencil, Eraser, Star, Heart, Flower2, Trash2, Move, Cloud, ArrowRight, Smile, Cat } from "lucide-react";
import { TemplateType, templateConfigs } from "../lib/templates";

interface DrawingToolsProps {
  selectedTool: "brush" | "eraser" | "move";
  onToolChange: (tool: "brush" | "eraser" | "move") => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  selectedTemplate: TemplateType | null;
  onSelectTemplate: (template: TemplateType | null) => void;
  onClearCanvas: () => void;
}

// Icon mapping
const templateIcons: Record<TemplateType, React.ReactNode> = {
  star: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
  heart: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />,
  flower: <Flower2 className="w-5 h-5 sm:w-6 sm:h-6" />,
  heartEyes: <Smile className="w-5 h-5 sm:w-6 sm:h-6" />,
  cloud: <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />,
  arrow: <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />,
  cat: <Cat className="w-5 h-5 sm:w-6 sm:h-6" />
};

export default function DrawingTools({
  selectedTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  selectedTemplate,
  onSelectTemplate,
  onClearCanvas,
}: DrawingToolsProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("Basic");

  // Get unique categories from template configs
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(Object.values(templateConfigs).map(config => config.category));
    return Array.from(uniqueCategories);
  }, []);

  // Get templates for the selected category
  const categoryTemplates = React.useMemo(() => {
    return Object.values(templateConfigs).filter(config => config.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="flex flex-col gap-2">
      {/* Main Tools Card */}
      <Card className="p-2 sm:p-3">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-pink-600">Tools</h2>
        
        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5">
            <button
              className={`flex-1 p-1.5 sm:p-2 rounded-lg border-2 transition-colors ${
                selectedTool === "brush"
                  ? "bg-pink-100 border-pink-400"
                  : "border-transparent hover:bg-gray-100"
              }`}
              onClick={() => onToolChange("brush")}
              aria-label="Brush tool"
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
            </button>
            
            <button
              className={`flex-1 p-1.5 sm:p-2 rounded-lg border-2 transition-colors ${
                selectedTool === "eraser"
                  ? "bg-pink-100 border-pink-400"
                  : "border-transparent hover:bg-gray-100"
              }`}
              onClick={() => onToolChange("eraser")}
              aria-label="Eraser tool"
            >
              <Eraser className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
            </button>

            <button
              className={`flex-1 p-1.5 sm:p-2 rounded-lg border-2 transition-colors ${
                selectedTool === "move"
                  ? "bg-pink-100 border-pink-400"
                  : "border-transparent hover:bg-gray-100"
              }`}
              onClick={() => onToolChange("move")}
              aria-label="Move tool"
            >
              <Move className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm text-gray-600">Brush Size</label>
            <Slider
              min={1}
              max={20}
              step={1}
              value={[brushSize]}
              onValueChange={(value) => onBrushSizeChange(value[0])}
              className="w-full"
            />
          </div>

          <button
            className="flex items-center justify-center w-full gap-1.5 p-1.5 text-xs sm:text-sm text-gray-600 rounded-lg hover:bg-gray-100"
            onClick={onClearCanvas}
            aria-label="Clear canvas"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            Clear Canvas
          </button>
        </div>
      </Card>

      {/* Templates Card */}
      <Card className="p-2 sm:p-3">
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-pink-600">Templates</h2>
        
        {/* Category Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide mb-2 pb-1.5 -mx-1 px-1">
          {categories.map((category) => (
            <button
              key={category}
              className={`shrink-0 px-1.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-medium transition-colors mr-1 ${
                selectedCategory === category
                  ? "bg-pink-100 text-pink-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-4 gap-1.5">
          {categoryTemplates.map((template) => (
            <button
              key={template.type}
              className={`aspect-square flex items-center justify-center p-1.5 sm:p-2 rounded-lg border-2 transition-colors ${
                selectedTemplate === template.type
                  ? "bg-pink-100 border-pink-400"
                  : "border-transparent hover:bg-gray-100"
              }`}
              onClick={() => onSelectTemplate(selectedTemplate === template.type ? null : template.type)}
              aria-label={`${template.type} template`}
            >
              {templateIcons[template.type]}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
