// SVG Data URIs matching Reagraph's CyberInvestigation iconMap architecture
// These render as billboard 2D icons inside WebGL node spheres

const svgToDataUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const flagSvg = svgToDataUri(`
<svg fill="#0891b2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
  <path d="M 13 0 C 4.476 0 1.46 1.476 0.59 2.062 C 0.488 2.117 0.39 2.191 0.312 2.281 L 0 2.812 L 0 49 C 0 49.55 0.45 50 1 50 C 1.55 50 2 49.55 2 49 L 2 30.656 C 3.168 30.184 6.703 29 13 29 C 16.535 29 19.215 29.789 22.312 30.688 C 26.07 31.777 30.324 33 37 33 C 43.91 33 49.273 30.004 49.5 29.875 L 50 29.594 L 50 2.312 L 48.531 3.125 C 47.281 3.8 42.754 6 37 6 C 32.223 6 28.898 4.566 25.375 3.062 C 21.828 1.551 18.156 0 13 0 Z" fill="#0891b2"/>
</svg>
`);

export const govSvg = svgToDataUri(`
<svg fill="#002244" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
  <path d="M 25 3 L 3 13 L 3 17 L 47 17 L 47 13 Z M 7 20 L 7 38 L 12 38 L 12 20 Z M 16 20 L 16 38 L 21 38 L 21 20 Z M 25 20 L 25 38 L 30 38 L 30 20 Z M 34 20 L 34 38 L 39 38 L 39 20 Z M 43 20 L 43 38 L 48 38 L 48 20 Z M 2 41 L 2 47 L 48 47 L 48 41 Z" fill="#002244"/>
</svg>
`);

export const projectSvg = svgToDataUri(`
<svg fill="#0284c7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
  <path d="M 12 4 C 9.79 4 8 5.79 8 8 L 8 42 C 8 44.21 9.79 46 12 46 L 38 46 C 40.21 46 42 44.21 42 42 L 42 16 L 30 4 L 12 4 Z M 28 7 L 39 18 L 28 18 L 28 7 Z M 15 24 L 35 24 L 35 27 L 15 27 Z M 15 30 L 35 30 L 35 33 L 15 33 Z M 15 36 L 27 36 L 27 39 L 15 39 Z" fill="#0284c7"/>
</svg>
`);

export const ministrySvg = svgToDataUri(`
<svg fill="#7c3aed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
  <path d="M 25 2 L 6 12 L 6 15 L 44 15 L 44 12 Z M 10 18 L 10 37 L 14 37 L 14 18 Z M 19 18 L 19 37 L 23 37 L 23 18 Z M 28 18 L 28 37 L 32 37 L 32 18 Z M 37 18 L 37 37 L 41 37 L 41 18 Z M 4 40 L 4 46 L 46 46 L 46 40 Z" fill="#7c3aed"/>
</svg>
`);

export const techSvg = svgToDataUri(`
<svg fill="#059669" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
  <path d="M 18 3 L 18 7 L 14 7 C 10.134 7 7 10.134 7 14 L 7 18 L 3 18 L 3 22 L 7 22 L 7 28 L 3 28 L 3 32 L 7 32 L 7 36 C 7 39.866 10.134 43 14 43 L 18 43 L 18 47 L 22 47 L 22 43 L 28 43 L 28 47 L 32 47 L 32 43 L 36 43 C 39.866 43 43 39.866 43 36 L 43 32 L 47 32 L 47 28 L 43 28 L 43 22 L 47 22 L 47 18 L 43 18 L 43 14 C 43 10.134 39.866 7 36 7 L 32 7 L 32 3 L 28 3 L 28 7 L 22 7 L 22 3 Z M 14 11 L 36 11 C 37.657 11 39 12.343 39 14 L 39 36 C 39 37.657 37.657 39 36 39 L 14 39 C 12.343 39 11 37.657 11 36 L 11 14 C 11 12.343 12.343 11 14 11 Z M 17 17 L 17 33 L 33 33 L 33 17 Z" fill="#059669"/>
</svg>
`);

export const policySvg = svgToDataUri(`
<svg fill="#d97706" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
  <path d="M 25 3 C 25 3 9 7 9 20 C 9 32 20 44 25 47 C 30 44 41 32 41 20 C 41 7 25 3 25 3 Z M 25 7.4 C 34.4 10.6 37 17.6 37 20 C 37 28.5 29.2 38.3 25 42.4 C 20.8 38.3 13 28.5 13 20 C 13 17.6 15.6 10.6 25 7.4 Z M 23 15 L 23 27 L 27 27 L 27 15 Z M 23 30 L 23 34 L 27 34 L 27 30 Z" fill="#d97706"/>
</svg>
`);

export const incidentSvg = svgToDataUri(`
<svg fill="#dc2626" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
  <path d="M 25 2 C 22.3 8.2 16 14.5 16 23 C 16 28 20 32 25 32 C 25 25 29 21 31 18 C 33 22 34 25 34 27 C 34.5 25 35 22.8 35 20.5 C 38.6 24.5 41 30 41 35 C 41 43.3 33.8 49 25 49 C 15.6 49 8 41.8 8 32 C 8 20.2 17.8 11.2 25 2 Z" fill="#dc2626"/>
</svg>
`);

export const iconMap: Record<string, string> = {
  country: flagSvg,
  Country: flagSvg,
  ministry: ministrySvg,
  Ministry: ministrySvg,
  project: projectSvg,
  Operation: projectSvg,
  Project: projectSvg,
  tech: techSvg,
  Technology: techSvg,
  policy: policySvg,
  Policy: policySvg,
  discrepancy: incidentSvg,
  Incident: incidentSvg,
  Discrepancy: incidentSvg,
  IBRD: govSvg,
  IDA: govSvg,
  IFC: govSvg,
  MIGA: govSvg,
};

export function getNodeIcon(category: string, subType?: string): string {
  if (subType && iconMap[subType]) {
    return iconMap[subType];
  }
  return iconMap[category] || projectSvg;
}
