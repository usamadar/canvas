import { Card } from "@/components/ui/card";
import { templates } from "@/lib/templates";
import { Image } from "lucide-react";

export default function TemplateGallery() {
  const loadTemplate = (imageUrl: string) => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate scaling to fit the template while maintaining aspect ratio
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      ) * 0.8;
      
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      
      ctx.drawImage(
        img,
        x,
        y,
        img.width * scale,
        img.height * scale
      );
    };
    img.src = imageUrl;
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-3 text-pink-600">Templates</h2>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template, index) => (
          <button
            key={index}
            className="p-2 rounded-lg hover:bg-pink-100 transition-colors"
            onClick={() => loadTemplate(template.url)}
          >
            <div className="relative aspect-square bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover"
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
