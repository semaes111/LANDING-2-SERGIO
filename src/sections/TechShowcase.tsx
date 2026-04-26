import ContainerScroll from '../components/effects/ContainerScroll'
import VideoQuoteOverlay from '../components/effects/VideoQuoteOverlay'

/**
 * Tech Showcase section — uses Container Scroll to present the technology
 * platform with a cinematic Apple-style entrance.
 *
 * Architecture:
 * - The outer ContainerScroll handles the rotateX + scale animation
 * - The video lives inside a "frame" with rounded corners and a thin border
 *   to feel like a device/screen showing the tech
 * - The header above (with eyebrow, title, subtitle) fades in as the video
 *   enters the scroll viewport
 * - When a future mobile-app mockup is available, it can replace the video
 *   here without changing the section structure
 */

export default function TechShowcase() {
  return (
    <ContainerScroll
      header={
        <>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              marginBottom: '20px',
              margin: 0,
              marginBlockEnd: '20px',
            }}
          >
            Tecnología clínica
          </p>
          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#ffffff',
              margin: 0,
              marginBlockEnd: '24px',
            }}
          >
            La medicina del siglo XXI
          </h2>
          <p
            style={{
              fontSize: 'clamp(15px, 1.4vw, 18px)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Pre-evaluación con IA, dashboards de adherencia, telemedicina y
            seguimiento continuo. Tecnología responsable al servicio del paciente.
          </p>
        </>
      }
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow:
            '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset',
          backgroundColor: '#000000',
        }}
      >
        <video
          src="/videos/spatial-medical.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />
        <VideoQuoteOverlay />
      </div>
    </ContainerScroll>
  )
}
