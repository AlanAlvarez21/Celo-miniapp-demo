// app/api/frame/route.ts
import { NextRequest } from 'next/server';
import { FrameRequest, type FrameButton } from '@farcaster/frame-core';
import { getFrameMessage } from 'frames.js';

export async function POST(req: NextRequest) {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    hubHttpUrl: 'https://hub-production.farcaster.xyz:2283',
  });

  if (!isValid) {
    return new Response('Invalid frame', { status: 400 });
  }

  const buttonIndex = message.button;
  let imageUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/og`; // Default image
  let buttons: FrameButton[] = [
    { label: 'Start Quiz', action: 'post' },
    { label: 'View Leaderboard', action: 'post' },
    { label: 'Connect Wallet', action: 'post' },
  ];

  // Determine next state based on button clicked
  switch (buttonIndex) {
    case 1:
      imageUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/og?screen=quiz`;
      break;
    case 2:
      imageUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/og?screen=leaderboard`;
      break;
    case 3:
      imageUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/og?screen=wallet`;
      break;
  }

  const searchParams = new URLSearchParams({
    isValid: isValid.toString(),
    fid: message.data.fid.toString(),
    button: buttonIndex.toString(),
  });

  const frameData = {
    image: imageUrl,
    buttons,
    postUrl: `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/frame?${searchParams}`,
    state: JSON.stringify({ screen: 'home' }),
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>IQ Quiz Contest</title>
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="${frameData.image}" />
        ${frameData.buttons.map((button, i) => `
          <meta name="fc:frame:button:${i + 1}" content="${button.label}" />
          <meta name="fc:frame:button:${i + 1}:action" content="${button.action}" />
        `).join('')}
        <meta name="fc:frame:post_url" content="${frameData.postUrl}" />
        <meta name="fc:frame:state" content="${frameData.state}" />
      </head>
      <body>
        <p>IQ Quiz Contest Frame</p>
      </body>
    </html>
  `;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}