export interface AnalyzeImageResult {
  diagramText: string;
  error?: string;
}

export async function analyzeImageForZenUml(
  imageFile: File
): Promise<AnalyzeImageResult> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return {
        diagramText: '',
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
                text: 'Analyze this image and create a ZenUML sequence diagram definition. ZenUML uses a simplified syntax for sequence diagrams. Return only the ZenUML code without any explanation or markdown formatting. Use ZenUML syntax like: A.method() { B.method2() { return } return }'
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
        diagramText: '',
        error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`
      };
    }

    const data = await response.json();
    let diagramText = data.choices[0]?.message?.content || '';
    
    // Remove markdown code block formatting if present
    diagramText = diagramText
      .replace(/^```[\w]*\n?/gm, '')
      .replace(/\n?```$/gm, '')
      .trim();

    return {
      diagramText
    };

  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      diagramText: '',
      error: error instanceof Error ? error.message : 'Failed to analyze image'
    };
  }
}
