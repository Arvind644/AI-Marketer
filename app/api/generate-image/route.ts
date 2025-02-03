import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, style } = await req.json();

    const response = await fetch('https://api.studio.nebius.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${process.env.NEBIUS_API_KEY}`,
      },
      body: JSON.stringify({
        width: 1024,
        height: 1024,
        num_inference_steps: 4,
        negative_prompt: "",
        seed: -1,
        response_extension: "webp",
        response_format: "b64_json",
        prompt: `${prompt} in ${style} style`,
        model: "black-forest-labs/flux-schnell"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Nebius API Error:', errorData);
      throw new Error(errorData.message || 'Failed to generate image');
    }

    const data = await response.json();
    const imageBase64 = data.data[0].b64_json;
    const imageUrl = `data:image/webp;base64,${imageBase64}`;

    return NextResponse.json({
      success: true,
      result: {
        content: imageUrl,
        role: 'assistant'
      }
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}
