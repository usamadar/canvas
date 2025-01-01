import React, { useState, useRef, useEffect } from "react";
import Canvas from "../components/Canvas";
import ColorPalette from "../components/ColorPalette";
import DrawingTools from "../components/DrawingTools";
import { TemplateType } from "../lib/templates";
import { Button } from "../components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "../hooks/use-toast";

interface CanvasRef {
  toDataURL: () => string;
}

export default function Home() {
  const [selectedColor, setSelectedColor] = useState("#FF69B4");
  const [selectedTool, setSelectedTool] = useState<"brush" | "eraser" | "move">("brush");
  const [brushSize, setBrushSize] = useState(5);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const canvasRef = useRef<CanvasRef | null>(null);
  const { toast } = useToast();

  const handleClearCanvas = () => {
    // Trigger a clear on the canvas component
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

      // Get the data URL from our custom method
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
    <div className="min-h-screen bg-pink-50 p-4">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-pink-600 mb-2">
          🎨 Little Artist Studio
        </h1>
        <p className="text-pink-400">Let's create something beautiful!</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-6">
          <ColorPalette
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
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
        <div className="space-y-4">
          <Canvas
            ref={canvasRef}
            color={selectedColor}
            tool={selectedTool}
            brushSize={brushSize}
            selectedTemplate={selectedTemplate}
          />
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              className="bg-white"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Artwork
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
