/**
 * Generate Mermaid diagram URL
 * Mermaid Live Editor API: https://mermaid.live/
 */
export function generateMermaidImageUrl(mermaidText: string): string {
  // Encode the Mermaid text to base64
  const base64 = Buffer.from(mermaidText).toString('base64');
  
  // Return Mermaid Live Editor URL with base64 encoded diagram
  return `https://mermaid.ink/img/${base64}`;
}
