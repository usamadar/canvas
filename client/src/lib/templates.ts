interface Template {
  name: string;
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  thumbnail: string;
}

export const templates: Template[] = [
  {
    name: "Heart",
    thumbnail: "💖",
    draw: (ctx, width, height) => {
      // Clear canvas with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);

      // Set up drawing style
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;

      // Calculate size and position
      const size = Math.min(width, height) * 0.4;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(size/100, size/100);

      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.bezierCurveTo(-25, -20, -50, -20, -50, 10);
      ctx.bezierCurveTo(-50, 40, -25, 50, 0, 60);
      ctx.bezierCurveTo(25, 50, 50, 40, 50, 10);
      ctx.bezierCurveTo(50, -20, 25, -20, 0, 20);
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    name: "Star",
    thumbnail: "⭐",
    draw: (ctx, width, height) => {
      // Clear canvas with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);

      // Set up drawing style
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;

      // Calculate size and position
      const size = Math.min(width, height) * 0.4;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(size/100, size/100);

      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          Math.cos((i * 4 * Math.PI) / 5 - Math.PI/2) * 50,
          Math.sin((i * 4 * Math.PI) / 5 - Math.PI/2) * 50
        );
        ctx.lineTo(
          Math.cos(((i * 4 + 2) * Math.PI) / 5 - Math.PI/2) * 20,
          Math.sin(((i * 4 + 2) * Math.PI) / 5 - Math.PI/2) * 20
        );
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    name: "Flower",
    thumbnail: "🌸",
    draw: (ctx, width, height) => {
      // Clear canvas with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);

      // Set up drawing style
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;

      // Calculate size and position
      const size = Math.min(width, height) * 0.4;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(size/100, size/100);

      // Draw petals
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.ellipse(0, -25, 15, 30, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw center
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }
  },
  {
    name: "Butterfly",
    thumbnail: "🦋",
    draw: (ctx, width, height) => {
      // Clear canvas with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);

      // Set up drawing style
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;

      // Calculate size and position
      const size = Math.min(width, height) * 0.4;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(size/100, size/100);

      // Draw wings
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.bezierCurveTo(-25, -50, -50, -25, -25, 0);
      ctx.bezierCurveTo(-50, 25, -25, 50, 0, 25);
      ctx.moveTo(0, -25);
      ctx.bezierCurveTo(25, -50, 50, -25, 25, 0);
      ctx.bezierCurveTo(50, 25, 25, 50, 0, 25);

      // Draw body
      ctx.moveTo(0, -25);
      ctx.lineTo(0, 25);
      ctx.stroke();

      ctx.restore();
    }
  }
];