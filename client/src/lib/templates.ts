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
      const scale = Math.min(width, height) * 0.8;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale/200, scale/200);

      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.bezierCurveTo(-50, -30, -90, -30, -90, 20);
      ctx.bezierCurveTo(-90, 80, -30, 100, 0, 120);
      ctx.bezierCurveTo(30, 100, 90, 80, 90, 20);
      ctx.bezierCurveTo(90, -30, 50, -30, 0, 30);
      ctx.stroke();
      ctx.restore();
    }
  },
  {
    name: "Star",
    thumbnail: "⭐",
    draw: (ctx, width, height) => {
      const scale = Math.min(width, height) * 0.8;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale/200, scale/200);

      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((i * 4 * Math.PI) / 5) * 100,
                  Math.sin((i * 4 * Math.PI) / 5) * 100);
        ctx.lineTo(Math.cos(((i * 4 + 2) * Math.PI) / 5) * 40,
                  Math.sin(((i * 4 + 2) * Math.PI) / 5) * 40);
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
      const scale = Math.min(width, height) * 0.8;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale/200, scale/200);

      // Draw petals
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.ellipse(0, -50, 30, 60, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw center
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }
  },
  {
    name: "Butterfly",
    thumbnail: "🦋",
    draw: (ctx, width, height) => {
      const scale = Math.min(width, height) * 0.8;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale/200, scale/200);

      // Draw wings
      ctx.beginPath();
      ctx.moveTo(0, -50);
      ctx.bezierCurveTo(-50, -100, -100, -50, -50, 0);
      ctx.bezierCurveTo(-100, 50, -50, 100, 0, 50);
      ctx.moveTo(0, -50);
      ctx.bezierCurveTo(50, -100, 100, -50, 50, 0);
      ctx.bezierCurveTo(100, 50, 50, 100, 0, 50);

      // Draw body
      ctx.moveTo(0, -50);
      ctx.lineTo(0, 50);
      ctx.stroke();

      ctx.restore();
    }
  }
];