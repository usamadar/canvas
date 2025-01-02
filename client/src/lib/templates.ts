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

export const drawHeartEyes = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  // Draw face circle
  ctx.beginPath();
  ctx.arc(x, y, size/2, 0, Math.PI * 2);
  ctx.stroke();

  // Draw smile
  ctx.beginPath();
  ctx.arc(x, y + size/8, size/3, 0, Math.PI);
  ctx.stroke();

  // Draw left heart eye
  const eyeSize = size/4;
  drawHeart(ctx, x - size/4, y - size/6, eyeSize);

  // Draw right heart eye
  drawHeart(ctx, x + size/4, y - size/6, eyeSize);
};

export const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  // Scale factor to fit our coordinate system
  const scale = size / 24;  // SVG viewport is 24x24
  
  ctx.save();
  ctx.translate(x - size/2, y - size/2);  // Center the drawing
  ctx.scale(scale, scale);

  // Draw the cloud path
  ctx.beginPath();
  ctx.moveTo(11.0947, 8.02658);
  ctx.lineTo(11.0947, 8.02658);
  
  // First curve
  ctx.moveTo(11.0947, 8.02658);
  ctx.bezierCurveTo(11.5476, 5.73111, 13.5717, 4, 16, 4);
  ctx.bezierCurveTo(18.7614, 4, 21, 6.23858, 21, 9);
  ctx.bezierCurveTo(21, 11.0345, 19.7849, 12.7852, 18.0408, 13.5659);
  
  // Second curve
  ctx.moveTo(11.0947, 8.02658);
  ctx.bezierCurveTo(9.24194, 8.21766, 7.68947, 9.4193, 7, 11);
  ctx.bezierCurveTo(4.6, 11.375, 3, 13.3144, 3, 15.4137);
  ctx.bezierCurveTo(3, 17.9466, 5.14903, 20, 7.8, 20);
  ctx.lineTo(15, 20);
  ctx.bezierCurveTo(17.2091, 20, 19, 18.2719, 19, 16.1402);
  ctx.bezierCurveTo(19, 15.1829, 18.6388, 14.2698, 18.0408, 13.5659);
  
  // Third curve
  ctx.moveTo(11.0947, 8.02658);
  ctx.bezierCurveTo(11.265, 8.00902, 11.4378, 8, 11.6127, 8);
  ctx.bezierCurveTo(14.2747, 8, 16.4504, 9.99072, 16.6, 12.5);
  ctx.bezierCurveTo(17.1583, 12.7354, 17.6501, 13.106, 18.0408, 13.5659);
  
  ctx.stroke();
  ctx.restore();
};

export const drawArrow = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  const arrowLength = size;
  const headLength = size/3;
  const headWidth = size/3;
  
  // Draw the shaft
  ctx.beginPath();
  ctx.moveTo(x - arrowLength/2, y);
  ctx.lineTo(x + arrowLength/2 - headLength, y);
  ctx.stroke();

  // Draw the arrowhead
  ctx.beginPath();
  ctx.moveTo(x + arrowLength/2, y);
  ctx.lineTo(x + arrowLength/2 - headLength, y - headWidth/2);
  ctx.lineTo(x + arrowLength/2 - headLength, y + headWidth/2);
  ctx.closePath();
  ctx.stroke();
};

export const drawCat = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  // Scale factor to fit our coordinate system
  const scale = size / 24;  // SVG viewport is 24x24
  
  ctx.save();
  ctx.translate(x - size/2, y - size/2);  // Center the drawing
  ctx.scale(scale, scale);

  // Draw the cat outline
  ctx.beginPath();
  // Eyes
  ctx.moveTo(8.5, 4.5);
  ctx.lineTo(8.5, 5);
  ctx.moveTo(11.5, 4.5);
  ctx.lineTo(11.5, 5);

  // Main body outline
  ctx.moveTo(7.5, 23.5);
  ctx.lineTo(7.5, 8);
  ctx.lineTo(5.5, 5.5);
  ctx.lineTo(5.5, 0.5);
  ctx.lineTo(9, 2.5);
  ctx.lineTo(11.5, 2.5);
  ctx.lineTo(14.5, 0.5);
  ctx.lineTo(14.5, 5.5);
  ctx.lineTo(12.5, 8);
  ctx.lineTo(20.5, 14);
  ctx.lineTo(22.5, 20);
  ctx.lineTo(20.5, 23.5);
  ctx.lineTo(5, 23.5);
  ctx.lineTo(2.5, 21);
  ctx.lineTo(5, 16.5);
  ctx.lineTo(1.5, 13);

  // Vertical lines
  ctx.moveTo(12.5, 23.5);
  ctx.lineTo(12.5, 13.5);
  ctx.moveTo(9.5, 23.5);
  ctx.lineTo(9.5, 13.5);

  // Additional details
  ctx.moveTo(17.5, 17.5);
  ctx.lineTo(15, 17.5);
  ctx.lineTo(12.5, 21.5);

  // Nose
  ctx.moveTo(9.5, 7);
  ctx.lineTo(10, 6.5);
  ctx.lineTo(10.5, 7);

  ctx.stroke();
  ctx.restore();
};

export type TemplateType = "star" | "heart" | "flower" | "heartEyes" | "cloud" | "arrow" | "cat";

interface TemplateConfig {
  type: TemplateType;
  category: string;
  lineWidth: number;
  strokeStyle: string;
  drawFunction: (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => void;
}

// Template configurations
export const templateConfigs: Record<TemplateType, TemplateConfig> = {
  star: {
    type: "star",
    category: "Basic",
    lineWidth: 2,
    strokeStyle: "#666",
    drawFunction: drawStar
  },
  heart: {
    type: "heart",
    category: "Basic",
    lineWidth: 2,
    strokeStyle: "#666",
    drawFunction: drawHeart
  },
  flower: {
    type: "flower",
    category: "Nature",
    lineWidth: 2,
    strokeStyle: "#666",
    drawFunction: drawFlower
  },
  heartEyes: {
    type: "heartEyes",
    category: "Emoji",
    lineWidth: 2,
    strokeStyle: "#666",
    drawFunction: drawHeartEyes
  },
  cloud: {
    type: "cloud",
    category: "Nature",
    lineWidth: 0.5,
    strokeStyle: "#666",
    drawFunction: drawCloud
  },
  arrow: {
    type: "arrow",
    category: "Basic",
    lineWidth: 2,
    strokeStyle: "#666",
    drawFunction: drawArrow
  },
  cat: {
    type: "cat",
    category: "Animals",
    lineWidth: 0.5,
    strokeStyle: "#666",
    drawFunction: drawCat
  }
};

export const drawTemplate = (
  ctx: CanvasRenderingContext2D, 
  template: TemplateType, 
  x: number, 
  y: number, 
  size: number
) => {
  const config = templateConfigs[template];
  
  ctx.save();
  ctx.strokeStyle = config.strokeStyle;
  ctx.lineWidth = config.lineWidth;
  
  config.drawFunction(ctx, x, y, size);
  
  ctx.restore();
};
