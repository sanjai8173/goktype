import { ImageResponse } from 'next/og';

export const alt = 'GokType — Minimalist Speed Typing Test & EdClub Finger Trainer';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#141419',
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(245, 176, 65, 0.15) 0%, transparent 60%)',
          fontFamily: 'monospace',
          color: '#e8e8ea',
          position: 'relative',
        }}
      >
        {/* Crown Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: '#ffffff',
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.2)',
            marginBottom: 28,
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="#0c0c0e"
            stroke="#0c0c0e"
            strokeWidth="2"
          >
            <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.52l4.277 3.664a1 1 0 0 0 1.516-.294z" />
            <path d="M5 21h14" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            marginBottom: 16,
          }}
        >
          gok<span style={{ color: '#71717a' }}>type</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 26,
            color: '#71717a',
            textAlign: 'center',
            maxWidth: 820,
            lineHeight: 1.4,
            marginBottom: 36,
          }}
        >
          Minimalist Speed Typing Test · Mechanical Switch Sounds · Monochrome Elegance
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              backgroundColor: '#18181b',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            typing.gokgok.in
          </div>
          <div
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              backgroundColor: '#1d1e25',
              border: '1px solid rgba(99, 101, 115, 0.3)',
              color: '#e8e8ea',
              fontSize: 18,
            }}
          >
            100% Free & Local
          </div>
          <div
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              backgroundColor: '#1d1e25',
              border: '1px solid rgba(99, 101, 115, 0.3)',
              color: '#e8e8ea',
              fontSize: 18,
            }}
          >
            by sanjai8173
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
