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
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height) * 0.3;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY + scale * 0.3);

      // Left curve
      ctx.bezierCurveTo(
        centerX - scale * 0.5, centerY - scale * 0.3,
        centerX - scale * 0.5, centerY,
        centerX, centerY + scale * 0.3
      );

      // Right curve
      ctx.bezierCurveTo(
        centerX + scale * 0.5, centerY,
        centerX + scale * 0.5, centerY - scale * 0.3,
        centerX, centerY + scale * 0.3
      );

      ctx.stroke();
    }
  },
  {
    name: "Star",
    thumbnail: "⭐",
    draw: (ctx, width, height) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.15;

      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = ((i * 4 * Math.PI) / 5) - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        // Draw inner point
        const innerAngle = angle + Math.PI / 5;
        const innerRadius = radius * 0.4;
        const innerX = centerX + Math.cos(innerAngle) * innerRadius;
        const innerY = centerY + Math.sin(innerAngle) * innerRadius;
        ctx.lineTo(innerX, innerY);
      }

      ctx.closePath();
      ctx.stroke();
    }
  },
  {
    name: "Flower",
    thumbnail: "🌸",
    draw: (ctx, width, height) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.15;

      // Draw petals
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.ellipse(
          centerX + Math.cos(angle) * radius * 0.7,
          centerY + Math.sin(angle) * radius * 0.7,
          radius * 0.5,
          radius * 0.8,
          angle,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Draw center
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
  {
    name: "Butterfly",
    thumbnail: "🦋",
    draw: (ctx, width, height) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height) * 0.2;

      // Left wing
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.bezierCurveTo(
        centerX - scale, centerY - scale,
        centerX - scale * 1.2, centerY - scale * 0.5,
        centerX, centerY
      );

      // Left lower wing
      ctx.moveTo(centerX, centerY);
      ctx.bezierCurveTo(
        centerX - scale, centerY + scale,
        centerX - scale * 1.2, centerY + scale * 0.5,
        centerX, centerY
      );

      // Right wing
      ctx.moveTo(centerX, centerY);
      ctx.bezierCurveTo(
        centerX + scale, centerY - scale,
        centerX + scale * 1.2, centerY - scale * 0.5,
        centerX, centerY
      );

      // Right lower wing
      ctx.moveTo(centerX, centerY);
      ctx.bezierCurveTo(
        centerX + scale, centerY + scale,
        centerX + scale * 1.2, centerY + scale * 0.5,
        centerX, centerY
      );

      ctx.stroke();

      // Body
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - scale * 0.8);
      ctx.lineTo(centerX, centerY + scale * 0.8);
      ctx.stroke();
    }
  }
];