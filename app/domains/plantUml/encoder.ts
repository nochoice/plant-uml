import plantumlEncoder from 'plantuml-encoder';

export function generatePlantUmlImageUrl(plantUmlText: string): string {
  const encoded = plantumlEncoder.encode(plantUmlText);
  return `https://www.plantuml.com/plantuml/svg/${encoded}`;
}
