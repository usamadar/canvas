import { Card } from "@/components/ui/card";
import { templates } from "@/lib/templates";
import { loadImageToCanvas } from "@/lib/drawingUtils";
import { useToast } from "@/hooks/use-toast";

export default function TemplateGallery() {
  const { toast } = useToast();

  const loadTemplate = async (imageUrl: string, templateName: string) => {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      toast({
        title: "Error",
        description: "Canvas not found",
        variant: "destructive",
      });
      return;
    }

    try {
      await loadImageToCanvas(canvas, imageUrl, {
        scale: 0.8,
        preserveAspectRatio: true,
        centerImage: true,
      });

      toast({
        title: "Template Loaded",
        description: `${templateName} template is ready for coloring!`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load template. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-3 text-pink-600">Templates</h2>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template, index) => (
          <button
            key={index}
            className="p-2 rounded-lg hover:bg-pink-100 transition-colors active:bg-pink-200"
            onClick={() => loadTemplate(template.url, template.name)}
          >
            <div className="relative aspect-square bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
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