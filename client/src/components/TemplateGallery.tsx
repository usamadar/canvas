import { Card } from "@/components/ui/card";
import { templates, createSVGTemplate } from "@/lib/templates";
import { loadImageToCanvas } from "@/lib/drawingUtils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function TemplateGallery() {
  const { toast } = useToast();
  const [loadingTemplate, setLoadingTemplate] = useState<number | null>(null);

  const loadTemplate = async (template: { url: string; name: string }, index: number) => {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      toast({
        title: "Error",
        description: "Canvas not found",
        variant: "destructive",
      });
      return;
    }

    setLoadingTemplate(index);

    try {
      // Convert SVG content to data URL
      const dataUrl = createSVGTemplate(template.url);

      await loadImageToCanvas(canvas, dataUrl, {
        scale: 0.8,
        preserveAspectRatio: true,
        centerImage: true,
      });

      toast({
        title: "Template Loaded",
        description: `${template.name} template is ready for coloring!`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to load template:", error);
      toast({
        title: "Error",
        description: "Failed to load template. Please try a different one.",
        variant: "destructive",
      });
    } finally {
      setLoadingTemplate(null);
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-3 text-pink-600">Templates</h2>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template, index) => (
          <button
            key={index}
            className="p-2 rounded-lg hover:bg-pink-100 transition-colors active:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => loadTemplate(template, index)}
            disabled={loadingTemplate !== null}
          >
            <div className="relative aspect-square bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              {loadingTemplate === index ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                  <Loader2 className="w-6 h-6 animate-spin text-pink-600" />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {template.thumbnail}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 mt-1 block">
              {template.name}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}