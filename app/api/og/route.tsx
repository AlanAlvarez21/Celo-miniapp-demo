// app/api/og/route.ts
import { ImageResponse } from '@vercel/og';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get screen parameter to customize the image
    const screen = searchParams.get('screen') ?? 'home';

    let title = 'IQ Quiz Contest';
    let description = 'Test your knowledge with our IQ quiz, pay 0.1 CELO to access your results';

    switch (screen) {
      case 'quiz':
        title = 'IQ Quiz - Test Your Knowledge';
        description = 'Answer challenging questions and prove your intelligence!';
        break;
      case 'leaderboard':
        title = 'IQ Quiz Leaderboard';
        description = 'See who the top performers are!';
        break;
      case 'wallet':
        title = 'Connect Your Wallet';
        description = 'Pay 0.1 CELO to access your quiz results';
        break;
    }

    return new ImageResponse(
      <div
        tw="bg-white bg-gradient-to-br from-[#f0f0f0] to-[#c0c0c0] w-full h-full flex flex-col items-center justify-center p-[40px_48px] text-center"
      >
        <div
          tw="flex flex-col items-center justify-center w-full h-full border-4 border-black bg-white p-[20px]"
        >
          <h1
            tw="text-[60px] font-bold text-black mb-[20px] uppercase"
          >
            {title}
          </h1>
          <p
            tw="text-[32px] text-black font-bold text-center"
          >
            {description}
          </p>
          <div
            tw="mt-[40px] flex items-center justify-center bg-[#FFD700] border-4 border-black p-[20px]"
          >
            <span
              tw="text-[40px] font-bold text-black"
            >
              Pay 0.1 CELO to Access Your Score
            </span>
          </div>
        </div>
      </div>,
      {
        width: 800,
        height: 400,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
