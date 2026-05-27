import { NextRequest, NextResponse } from 'next/server';
import { sendAgentReceipt } from '../../../lib/agent';

export async function POST(req: NextRequest) {
  try {
    const { prompt, userAddress } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            { text: prompt, weight: 1 },
            { text: 'blurry, bad quality, watermark, ugly, deformed, text, words, letters, typography, writing, font, label, caption, title, heading', weight: -1 },
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Stability API error:', err);
      return NextResponse.json(
        { error: err?.message || 'Image generation failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const base64Image = data.artifacts?.[0]?.base64;

    if (!base64Image) {
      return NextResponse.json({ error: 'No image returned' }, { status: 500 });
    }

    const imageUrl = `data:image/png;base64,${base64Image}`;

    // Broadcast the AI Agent's on-chain delivery receipt
    let agentTxHash = null;
    if (userAddress) {
      agentTxHash = await sendAgentReceipt(userAddress, prompt, imageUrl);
    }

    return NextResponse.json({ imageUrl, agentTxHash });
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}