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
      // Draw at 1/3 of the canvas size for visibility
      const w = width / 3;
      const h = height / 3;
      const x = width / 2;  // center x
      const y = height / 2; // center y

      ctx.beginPath();
      ctx.moveTo(x, y + h/4);

      // Left curve
      ctx.bezierCurveTo(
        x - w/2, y - h/2,  // control point 1
        x - w/2, y - h/4,  // control point 2
        x, y + h/4   // end point
      );

      // Right curve
      ctx.bezierCurveTo(
        x + w/2, y - h/4,  // control point 1
        x + w/2, y - h/2,  // control point 2
        x, y + h/4   // end point
      );

      ctx.stroke();
    }
  },
  {
    name: "Star",
    thumbnail: "⭐",
    draw: (ctx, width, height) => {
      const size = Math.min(width, height) / 3;
      const x = width / 2;
      const y = height / 2;
      const points = 5;
      const outerRadius = size / 2;
      const innerRadius = outerRadius * 0.4;

      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const pointX = x + radius * Math.cos(angle);
        const pointY = y + radius * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
  },
  {
    name: "Flower",
    thumbnail: "🌸",
    draw: (ctx, width, height) => {
      const size = Math.min(width, height) / 3;
      const x = width / 2;
      const y = height / 2;
      const petalSize = size / 4;

      // Draw petals
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const dx = Math.cos(angle) * petalSize;
        const dy = Math.sin(angle) * petalSize;

        ctx.beginPath();
        ctx.ellipse(
          x + dx, 
          y + dy, 
          petalSize * 0.7, 
          petalSize * 1.2, 
          angle, 
          0, 
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Draw center
      ctx.beginPath();
      ctx.arc(x, y, petalSize * 0.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
  {
    name: "Butterfly",
    thumbnail: "🦋",
    draw: (ctx, width, height) => {
      const size = Math.min(width, height) / 3;
      const x = width / 2;
      const y = height / 2;

      // Draw wings
      // Left upper wing
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x - size/2, y - size/2,
        x - size/2, y - size/4,
        x, y
      );

      // Left lower wing
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x - size/2, y + size/2,
        x - size/2, y + size/4,
        x, y
      );

      // Right upper wing
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x + size/2, y - size/2,
        x + size/2, y - size/4,
        x, y
      );

      // Right lower wing
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(
        x + size/2, y + size/2,
        x + size/2, y + size/4,
        x, y
      );

      ctx.stroke();

      // Draw body
      ctx.beginPath();
      ctx.moveTo(x, y - size/4);
      ctx.lineTo(x, y + size/4);
      ctx.stroke();
    }
  }
];