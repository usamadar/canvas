export const templates = [
  {
    name: "Butterfly",
    url: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke="black" stroke-width="2" d="M200 100 C150 50 100 50 50 100 C0 150 0 200 50 250 C100 300 150 300 200 250 M200 100 C250 50 300 50 350 100 C400 150 400 200 350 250 C300 300 250 300 200 250 M200 100 L200 300 M180 150 L220 150"/>`,
    thumbnail: "🦋"
  },
  {
    name: "Heart",
    url: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke="black" stroke-width="2" d="M200 300 C150 250 50 200 50 125 C50 75 100 50 150 75 C175 90 200 150 200 150 C200 150 225 90 250 75 C300 50 350 75 350 125 C350 200 250 250 200 300 Z"/>`,
    thumbnail: "💖"
  },
  {
    name: "Flower",
    url: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke="black" stroke-width="2" d="M200 100 C150 50 100 50 100 100 C100 150 150 150 200 100 M200 100 C250 50 300 50 300 100 C300 150 250 150 200 100 M200 200 C150 150 100 150 100 200 C100 250 150 250 200 200 M200 200 C250 150 300 150 300 200 C300 250 250 250 200 200 M200 150 L200 250"/>`,
    thumbnail: "🌸"
  },
  {
    name: "Star",
    url: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke="black" stroke-width="2" d="M200 50 L230 150 L330 150 L250 200 L280 300 L200 240 L120 300 L150 200 L70 150 L170 150 Z"/>`,
    thumbnail: "⭐"
  },
  {
    name: "Castle",
    url: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke="black" stroke-width="2" d="M50 300 L50 200 L100 200 L100 150 L150 150 L150 100 L250 100 L250 150 L300 150 L300 200 L350 200 L350 300 L275 300 L275 250 L225 250 L225 300 L175 300 L175 250 L125 250 L125 300 Z M150 100 L150 50 L175 25 L200 50 L225 25 L250 50 L250 100"/>`,
    thumbnail: "🏰"
  },
  {
    name: "Rainbow",
    url: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <path fill="none" stroke="black" stroke-width="2" d="M50 300 C50 200 150 100 200 100 C250 100 350 200 350 300 M75 300 C75 225 150 150 200 150 C250 150 325 225 325 300 M100 300 C100 250 150 200 200 200 C250 200 300 250 300 300"/>`,
    thumbnail: "🌈"
  }
];

export function createSVGTemplate(svgContent: string): string {
  // Create a data URL from the SVG content
  const encoded = encodeURIComponent(svgContent);
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}