export interface AnalyzeImageResult {
  plantUmlText: string;
  error?: string;
}

export async function analyzeImageWithOpenAI(
  imageFile: File
): Promise<AnalyzeImageResult> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return {
        plantUmlText: '',
        error: 'OpenAI API key not configured'
      };
    }

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const imageUrl = `data:${imageFile.type};base64,${base64Image}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and create a PlantUML text definition. Return only the PlantUML code without any explanation or markdown formatting.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        plantUmlText: '',
        error: `OpenAI API error: ${errorData.error?.message || response.statusText}`
      };
    }

    const data = await response.json();
    let plantUmlText = data.choices[0]?.message?.content || '';

    // Strip markdown code blocks (```plantuml, ```, etc.)
    plantUmlText = plantUmlText
      .replace(/^```[\w]*\n?/gm, '')  // Remove opening ```
      .replace(/\n?```$/gm, '')        // Remove closing ```
      .trim();

    return {
      plantUmlText,
    };
  } catch (error) {
    return {
      plantUmlText: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
