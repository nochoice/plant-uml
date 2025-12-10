/**
 * Generate ZenUML diagram URL
 * ZenUML API: https://zenuml.com/
 */
export function generateZenUmlImageUrl(zenUmlText: string): string {
  // Encode the ZenUML text to base64
  const base64 = Buffer.from(zenUmlText).toString('base64');
  
  // Return ZenUML image URL (PNG format)
  // ZenUML provides image export via their API
  return `https://zenuml.com/api/png/${base64}`;
}
