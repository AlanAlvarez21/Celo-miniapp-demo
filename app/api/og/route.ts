// app/api/og/route.ts
import { ImageResponse } from 'next/og';

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
      (
        <div
          style={{
            backgroundColor: 'white',
            background:
              'linear-gradient(to bottom right, #f0f0f0, #c0c0c0)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 48px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              border: '4px solid black',
              backgroundColor: 'white',
              padding: '20px',
            }}
          >
            <h1
              style={{
                fontSize: 60,
                fontWeight: 'bold',
                color: 'black',
                marginBottom: 20,
                textTransform: 'uppercase',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 32,
                color: 'black',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {description}
            </p>
            <div
              style={{
                marginTop: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFD700',
                border: '4px solid black',
                padding: '20px',
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 'bold',
                  color: 'black',
                }}
              >
                Pay 0.1 CELO to Access Your Score
              </span>
            </div>
          </div>
        </div>
      ),
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