// Drawing template utilities
export const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  const spikes = 5;
  const outerRadius = size;
  const innerRadius = size / 2;
  
  let rot = Math.PI / 2 * 3;
  let step = Math.PI / spikes;
  
  ctx.beginPath();
  ctx.moveTo(x, y - outerRadius);
  
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(
      x + Math.cos(rot) * outerRadius,
      y + Math.sin(rot) * outerRadius
    );
    rot += step;
    
    ctx.lineTo(
      x + Math.cos(rot) * innerRadius,
      y + Math.sin(rot) * innerRadius
    );
    rot += step;
  }
  
  ctx.lineTo(x, y - outerRadius);
  ctx.closePath();
  ctx.stroke();
};

export const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  const width = size;
  const height = size;
  
  ctx.beginPath();
  ctx.moveTo(x, y + height / 4);
  
  // Left curve
  ctx.quadraticCurveTo(x - width / 2, y - height / 2, x, y - height / 4);
  
  // Right curve
  ctx.quadraticCurveTo(x + width / 2, y - height / 2, x, y + height / 4);
  
  ctx.closePath();
  ctx.stroke();
};

export const drawFlower = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  const petalCount = 6;
  const petalSize = size / 2;
  
  // Draw petals
  for (let i = 0; i < petalCount; i++) {
    const angle = (Math.PI * 2 * i) / petalCount;
    const dx = Math.cos(angle) * petalSize;
    const dy = Math.sin(angle) * petalSize;
    
    ctx.beginPath();
    ctx.ellipse(x + dx, y + dy, petalSize/2, petalSize/2, angle, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Draw center
  ctx.beginPath();
  ctx.arc(x, y, size/4, 0, Math.PI * 2);
  ctx.stroke();
};

export type TemplateType = "star" | "heart" | "flower";

export const drawTemplate = (
  ctx: CanvasRenderingContext2D, 
  template: TemplateType, 
  x: number, 
  y: number, 
  size: number
) => {
  ctx.save();
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 2;
  
  switch (template) {
    case "star":
      drawStar(ctx, x, y, size);
      break;
    case "heart":
      drawHeart(ctx, x, y, size);
      break;
    case "flower":
      drawFlower(ctx, x, y, size);
      break;
  }
  
  ctx.restore();
};
