import React, { useState, useRef, useEffect } from "react";
import Canvas from "../components/Canvas";
import ColorPalette from "../components/ColorPalette";
import DrawingTools from "../components/DrawingTools";
import { TemplateType } from "../lib/templates";
import { Button } from "../components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { DrawingTool } from "@/types/canvas";

interface CanvasRef {
  toDataURL: () => string;
}

export default function Home() {
  const [selectedColor, setSelectedColor] = useState("#FF69B4");
  const [selectedTool, setSelectedTool] = useState<DrawingTool>("brush");
  const [brushSize, setBrushSize] = useState(5);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const canvasRef = useRef<CanvasRef | null>(null);
  const { toast } = useToast();

  const handleClearCanvas = () => {
    const clearEvent = new CustomEvent('clearCanvas');
    window.dispatchEvent(clearEvent);
  };

  // Reset template selection after it's drawn
  useEffect(() => {
    const handleTemplateDrawn = () => {
      setSelectedTemplate(null);
    };
    window.addEventListener('templateDrawn', handleTemplateDrawn);
    return () => window.removeEventListener('templateDrawn', handleTemplateDrawn);
  }, []);

  const handleSave = async () => {
    try {
      if (!canvasRef.current) {
        throw new Error("Canvas not found");
      }

      const dataUrl = canvasRef.current.toDataURL();
      const link = document.createElement("a");
      link.download = "my-drawing.png";
      link.href = dataUrl;
      link.click();

      toast({
        title: "Saved!",
        description: "Your artwork has been saved successfully!",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Failed to save your artwork. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 px-2 py-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-2">
        <header className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl sm:text-2xl">🎨</span>
            <h1 className="text-xl sm:text-2xl font-bold text-pink-500">Little Artist Studio</h1>
          </div>
          <p className="text-pink-400 text-sm mt-0.5">Let's create something beautiful!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-2">
          <div className="flex flex-col gap-2">
            <ColorPalette
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              onToolChange={setSelectedTool}
            />
            <DrawingTools
              selectedTool={selectedTool}
              onToolChange={setSelectedTool}
              brushSize={brushSize}
              onBrushSizeChange={setBrushSize}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              onClearCanvas={handleClearCanvas}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Canvas
              ref={canvasRef}
              color={selectedColor}
              tool={selectedTool}
              brushSize={brushSize}
              selectedTemplate={selectedTemplate}
            />
            
            <div className="flex justify-end">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-pink-600 bg-white rounded-lg shadow hover:bg-pink-50"
                onClick={handleSave}
              >
                <Save className="w-4 h-4" />
                Save Artwork
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
