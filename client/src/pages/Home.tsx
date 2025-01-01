import { useState, useRef } from "react";
import Canvas from "@/components/Canvas";
import ColorPalette from "@/components/ColorPalette";
import DrawingTools from "@/components/DrawingTools";
import TemplateGallery from "@/components/TemplateGallery";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedColor, setSelectedColor] = useState("#FF69B4");
  const [selectedTool, setSelectedTool] = useState<"brush" | "eraser">("brush");
  const [brushSize, setBrushSize] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      if (!canvasRef.current) {
        throw new Error("Canvas not found");
      }
      const dataUrl = canvasRef.current.toDataURL("image/png");
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
          />

          <TemplateGallery canvasRef={canvasRef} />
        </div>

        <div className="space-y-4">
          <Canvas
            ref={canvasRef}
            color={selectedColor}
            tool={selectedTool}
            brushSize={brushSize}
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