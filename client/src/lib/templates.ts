// Drawing template utilities
/**
 * Draws a star shape on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {number} x - The x-coordinate of the star's center
 * @param {number} y - The y-coordinate of the star's center
 * @param {number} size - The size of the star
 */
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

/**
 * Draws a heart shape on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {number} x - The x-coordinate of the heart's center
 * @param {number} y - The y-coordinate of the heart's center
 * @param {number} size - The size of the heart
 */
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

/**
 * Draws a flower shape with multiple petals on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {number} x - The x-coordinate of the flower's center
 * @param {number} y - The y-coordinate of the flower's center
 * @param {number} size - The size of the flower
 */
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

/**
 * Draws a smiley face with heart-shaped eyes
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {number} x - The x-coordinate of the face's center
 * @param {number} y - The y-coordinate of the face's center
 * @param {number} size - The size of the face
 */
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

/**
 * Draws a cloud shape using bezier curves
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {number} x - The x-coordinate of the cloud's center
 * @param {number} y - The y-coordinate of the cloud's center
 * @param {number} size - The size of the cloud
 */
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

/**
 * Draws an apple shape using SVG path data
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {number} x - The x-coordinate of the apple's center
 * @param {number} y - The y-coordinate of the apple's center
 * @param {number} size - The size of the apple
 * @description This function draws a detailed apple using SVG path data.
 * The apple includes:
 * - A main body with curved edges and characteristic indent
 * - A leaf detail on top
 * - A stem
 * The drawing is scaled and centered based on the provided size parameter.
 */
// Draws the apple outline (body + stem + leaf) from the given SVG path data
export const drawApple = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) => {
  // We’ll pretend the original viewBox is 281.25 wide/high, but we only want 24 "units"
  // to stay consistent with your other icons. So let's do size/24, 
  // *and* apply an internal scale from 281.25 → 24.
  // Another approach is to just do size / 281.25 if you want the original scale.

  const scaleFactor = size / 24;
  const svgToIconScale = 24 / 281.25; 
  const totalScale = scaleFactor * svgToIconScale;

  // Save the context state before transformations
  ctx.save();

  // Shift so (x,y) is the center
  ctx.translate(x - size/2, y - size/2);  // Scale from SVG size down to 24, and then up to the requested size
  ctx.scale(totalScale, totalScale);

  // These numbers in the path are offset pretty far negative, so let’s nudge them
  // back by translating in the opposite direction. If we skip this, the apple
  // will just be way off to the side.
  // We can see from the path that it’s around -4043 in X and ~ +4700 in Y,
  // so let’s shift it enough that it ends up roughly at (0,0).
  // A quick approach is to add +4043 in X and -4713 in Y (just picking close numbers
  // from the path start). 
  // You can tweak if you want it more perfectly centered. 
  ctx.translate(4135, -4690);

  // Main Apple Body (red part) from the path’s "d" attribute
  const appleBody = new Path2D(`
    m -4043.383,4779.0067
    a 4.6875,4.6875 0 0 0 -0.3699,0.073
    a 4.6875,4.6875 0 0 0 -0.2563,-0.033
    c -14.1652,1.9133 -27.2426,9.7973 -35.5481,21.4307
    -8.5118,11.9223 -11.5086,26.7027 -11.0285,40.7995
    0.7792,22.88 10.0958,44.0304 20.149,63.5102
    3.9318,7.6184 8.2455,15.5866 14.6392,22.3352
    6.4503,6.8084 15.1917,12.2452 25.2228,12.865
    8.0253,0.4958 16.0288,-2.2669 22.0606,-7.5733
    a 4.6875,4.6875 0 0 0 0.024,-0.015
    c 4.226,-3.2432 9.5407,-5.1768 14.8626,-5.4071
    6.066,-0.2625 12.322,1.7106 17.1387,5.4071
    a 4.6875,4.6875 0 0 0 0.029,0.018
    c 6.0312,5.3041 14.0315,8.0653 22.0551,7.5696
    10.0311,-0.6198 18.7724,-6.0566 25.2227,-12.865
    6.3937,-6.7486 10.7094,-14.7168 14.6412,-22.3352
    10.0531,-19.4798 19.3697,-40.6302 20.1489,-63.5102
    0.4801,-14.0968 -2.5185,-28.8791 -11.0303,-40.8014
    -8.3055,-11.6334 -21.381,-19.5155 -35.5463,-21.4288
    a 4.6875,4.6875 0 0 0 -0.6244,-0.04
    z
    m 0.3589,9.375
    h 101.0705
    c 11.4053,1.6203 22.2087,8.1689 28.9014,17.5434
    6.9696,9.7622 9.7175,22.5003 9.2908,35.0317
    -0.6986,20.5116 -9.2527,40.4295 -19.1107,59.5313
    -3.8579,7.4751 -7.828,14.6059 -13.1159,20.1873
    -5.2315,5.5218 -12.0718,9.5278 -18.9935,9.9555
    -5.552,0.343 -11.3828,-1.6969 -15.5091,-5.4273
    a 4.6875,4.6875 0 0 0 -0.015,-0.01
    a 4.6875,4.6875 0 0 0 -0.2765,-0.2325
    c -6.6134,-5.0754 -14.9202,-7.6994 -23.2489,-7.3389
    -7.2877,0.3154 -14.3822,2.8979 -20.1691,7.3389
    a 4.6875,4.6875 0 0 0 -0.1886,0.1886
    a 4.6875,4.6875 0 0 0 -0.1007,0.051
    c -4.1263,3.7304 -9.9552,5.7703 -15.5072,5.4273
    -6.9217,-0.4277 -13.762,-4.4337 -18.9935,-9.9555
    -5.2879,-5.5814 -9.2579,-12.7122 -13.1158,-20.1873
    -9.8581,-19.1018 -18.4122,-39.0197 -19.1108,-59.5313
    -0.4267,-12.5314 2.3194,-25.2695 9.289,-35.0317
    6.6927,-9.3745 17.4979,-15.9231 28.9032,-17.5434
    z
    m 89.0368,16.6425
    c -2.6446,0.059 -5.2816,0.5031 -7.8186,1.3348
    a 4.6875,4.6875 0 0 0 -2.9956,5.9143
    4.6875,4.6875 0 0 0 5.9143,2.9938
    c 3.7291,-1.2225 7.9835,-1.1387 11.662,0.2289
    3.6784,1.3676 6.9548,4.0833 8.9795,7.4451
    2.6048,4.3249 3.2169,10.0401 1.5875,14.8187
    a 4.6875,4.6875 0 0 0 2.9242,5.9491
    4.6875,4.6875 0 0 0 5.9491,-2.9242
    c 2.559,-7.5046 1.661,-15.8874 -2.4298,-22.6795
    -3.1485,-5.2276 -8.022,-9.2698 -13.742,-11.3964
    -2.86,-1.0633 -5.8746,-1.6254 -8.8971,-1.6846
    -0.3778,-0.01 -0.7556,-0.01 -1.1335,0
    z
  `);

  // If you just want the outline, use stroke. If you want it filled, do fill.
  ctx.stroke(appleBody);

  // Stem + Leaf from the second path
  const stemLeaf = new Path2D(`
    m -4027.4034,4713.4495
    c -5.2285,0.042 -10.4418,1.027 -15.3332,2.9278
    a 4.6875,4.6875 0 0 0 -0.1923,0.1117
    a 4.6875,4.6875 0 0 0 -0.6281,0.3662
    a 4.6875,4.6875 0 0 0 -0.5969,0.4267
    a 4.6875,4.6875 0 0 0 -0.4852,0.5438
    a 4.6875,4.6875 0 0 0 -0.4303,0.5841
    a 4.6875,4.6875 0 0 0 -0.2985,0.6775
    a 4.6875,4.6875 0 0 0 -0.2252,0.683
    a 4.6875,4.6875 0 0 0 -0.071,0.2142
    c -1.5322,9.3059 0.7687,19.0187 6.3116,26.6492
    5.5429,7.6305 14.0661,12.8184 23.3899,14.2383
    5.9354,0.9039 11.9993,0.232 17.569,-1.8055
    -1.3937,6.5458 -1.4701,13.3591 -0.1794,19.9402
    h 9.6112
    c -2.3214,-9.5013 -1.045,-19.9938 3.6071,-28.5717
    5.7994,-10.6935 17.0215,-18.5596 29.0516,-20.365
    a 4.6875,4.6875 0 0 0 3.9404,-5.3321
    4.6875,4.6875 0 0 0 -5.3302,-3.9386
    c -11.8552,1.7792 -22.7709,8.0402 -30.4285,17.1497
    -2.4139,-5.013 -5.7826,-9.5566 -9.9243,-13.3099
    -5.9255,-5.37 -13.3089,-9.0235 -21.1725,-10.4773
    -1.9658,-0.3634 -3.9525,-0.5871 -5.9436,-0.6739
    -0.7466,-0.033 -1.4943,-0.044 -2.2412,-0.038
    z
    m 0.6647,9.3786
    c 1.953,0.016 3.9027,0.1994 5.8154,0.553
    6.1208,1.1316 11.9698,4.0252 16.582,8.205
    4.4159,4.0019 7.7574,9.2581 9.56,14.9542
    -5.5522,4.1615 -12.9447,6.1023 -19.7699,5.0629
    -6.7585,-1.0292 -13.1991,-4.95 -17.2174,-10.481
    -3.4843,-4.7971 -5.2509,-10.951 -4.9347,-16.9006
    3.2228,-0.9494 6.5988,-1.4214 9.9646,-1.3935
    z
  `);

  ctx.stroke(stemLeaf);

  // Restore context to how it was before
  ctx.restore();
};


/**
 * Draws a cat shape with detailed features
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {number} x - The x-coordinate of the cat's center
 * @param {number} y - The y-coordinate of the cat's center
 * @param {number} size - The size of the cat
 * @description This function draws a detailed cat using line paths.
 * The cat includes:
 * - A main body outline
 * - Eyes and nose details
 * - Vertical stripes
 * - Additional decorative elements
 * The drawing is scaled and centered based on the provided size parameter.
 */
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

/**
 * Draws a birthday cake with candles and decorative details
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {number} x - The x-coordinate of the cake's center
 * @param {number} y - The y-coordinate of the cake's center
 * @param {number} size - The size of the cake
 * @description This function draws a detailed birthday cake using SVG path data.
 * The cake includes:
 * - A decorated base with wavy patterns
 * - Two candles on top
 * - Decorative frosting details
 * The drawing is scaled and centered based on the provided size parameter.
 */
export const drawCake = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  // The original SVG viewBox is 0 0 32 32
  const scale = size / 32;

  ctx.save();
  // Move to where we want to draw the cake
  ctx.translate(x - size / 2, y - size / 2);
  ctx.scale(scale, scale);

  // Create a new path from the SVG path data
  const cakePath = new Path2D(`
    M7.38,30.74H24.62c.41,0,.75-.34,.75-.75V14.59c0-.41-.34-.75-.75-.75h-2.66v-5.38
    c0-.2-.08-.39-.21-.52.43-.65.67-1.43.67-2.23,0-1.35-.67-2.6-1.78-3.37-.26-.17-.59-.17-.85,0
    -1.12,.76-1.78,2.02-1.78,3.37,0,.8,.24,1.57,.67,2.23-.13,.14-.21,.32-.21,.52v5.38h-5.52v-5.38
    c0-.2-.08-.39-.21-.52.43-.65.67-1.43.67-2.23,0-1.35-.67-2.6-1.78-3.37-.26-.17-.59-.17-.85,0
    -1.12,.76-1.78,2.02-1.78,3.37,0,.8,.24,1.57,.67,2.23-.13,.14-.21,.32-.21,.52v5.38h-2.07
    c-.41,0-.75,.34-.75,.75v15.4c0,.41,.34,.75,.75,.75Z
    M23.87,25.47H8.13v-6.83c.14,.1.27,.23.44,.39.46,.46,1.08,1.08,2.25,1.08s1.8-.63,2.25-1.08
    c.43-.43.66-.64,1.19-.64s.76,.21,1.19,.64c.46,.46,1.08,1.08,2.25,1.08s1.8-.63,2.26-1.08
    c.43-.43.67-.64,1.19-.64s.76,.21,1.2,.64c.35,.35.79,.79,1.51,.98v5.46Z
    M23.87,29.24H8.13v-2.27h15.74v2.27Z
    M20.21,3.94c.45,.48.71,1.11.71,1.77s-.26,1.29-.71,1.77c-.45-.48-.71-1.11-.71-1.77s.26-1.29.71-1.77Z
    M19.96,9.21h.5v4.63h-.5V9.21Z
    M11.2,3.94c.45,.48.71,1.11.71,1.77s-.26,1.29-.71,1.77c-.45-.48-.71-1.11-.71-1.77s.26-1.29.71-1.77Z
    M10.95,9.21h.5v4.63h-.5V9.21Z
    M10.2,15.34h13.67v3.02c-.14-.1-.28-.23-.45-.4-.46-.46-1.08-1.08-2.26-1.08s-1.8,.63-2.26,1.08
    c-.43,.43-.67,.64-1.2,.64s-.76-.21-1.19-.64c-.46-.46-1.08-1.08-2.25-1.08s-1.8,.63-2.25,1.08
    c-.43,.43-.67,.64-1.19,.64s-.76-.21-1.19-.64c-.35-.35-.79-.79-1.5-.98v-1.64h2.07Z
  `);

  // Draw the outline of the cake
  ctx.stroke(cakePath);
  ctx.restore();
};

export type TemplateType = "star" | "heart" | "flower" | "heartEyes" | "cloud" | "apple" | "cat" | "cake";

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
    lineWidth: 0.2,
    strokeStyle: "#666",
    drawFunction: drawCloud
  },
  apple: {
    type: "apple",
    category: "Food",
    lineWidth: 2,
    strokeStyle: "#666",
    drawFunction: drawApple
  },
  cat: {
    type: "cat",
    category: "Animals",
    lineWidth: 0.2,
    strokeStyle: "#666",
    drawFunction: drawCat
  },
  cake: {
    type: "cake",
    category: "Food",
    lineWidth: 0.2,
    strokeStyle: "#666",
    drawFunction: drawCake
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
