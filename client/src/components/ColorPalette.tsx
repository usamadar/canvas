import { Card } from "@/components/ui/card";

interface ColorPaletteProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
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

export default function ColorPalette({ selectedColor, onColorChange }: ColorPaletteProps) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-3 text-pink-600">Colors</h2>
      <div className="grid grid-cols-4 gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`w-12 h-12 rounded-full border-4 transition-transform hover:scale-110 ${
              selectedColor === color ? "border-pink-400" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>
    </Card>
  );
}
