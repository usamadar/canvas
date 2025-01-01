interface Template {
  name: string;
  path: string;
  thumbnail: string;
}

export const templates: Template[] = [
  {
    name: "Heart",
    path: "M 200,300 C 150,250 50,200 50,125 C 50,75 100,50 150,75 C 175,90 200,150 200,150 C 200,150 225,90 250,75 C 300,50 350,75 350,125 C 350,200 250,250 200,300 Z",
    thumbnail: "💖"
  },
  {
    name: "Star",
    path: "M 200,50 L 230,150 L 330,150 L 250,200 L 280,300 L 200,240 L 120,300 L 150,200 L 70,150 L 170,150 Z",
    thumbnail: "⭐"
  },
  {
    name: "Flower",
    path: "M 200,150 C 180,100 120,100 120,150 C 120,200 180,200 200,150 M 200,150 C 220,100 280,100 280,150 C 280,200 220,200 200,150 M 200,250 C 180,200 120,200 120,250 C 120,300 180,300 200,250 M 200,250 C 220,200 280,200 280,250 C 280,300 220,300 200,250",
    thumbnail: "🌸"
  },
  {
    name: "Butterfly",
    path: "M 200,100 C 150,50 100,50 50,100 C 0,150 0,200 50,250 C 100,300 150,300 200,250 M 200,100 C 250,50 300,50 350,100 C 400,150 400,200 350,250 C 300,300 250,300 200,250 M 200,100 L 200,300",
    thumbnail: "🦋"
  }
];

export function drawTemplateOnCanvas(canvas: HTMLCanvasElement, path: string): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set up the path styling
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Create a new path from the SVG path data
  const templatePath = new Path2D(path);

  // Scale and center the path
  const scale = 0.8;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);
  ctx.translate(-200, -200); // Center based on viewBox

  // Draw the path
  ctx.stroke(templatePath);
  ctx.restore();
}