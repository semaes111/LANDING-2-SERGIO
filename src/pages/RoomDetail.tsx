import { useEffect, useState } from 'react'
import { rooms } from '../data/rooms'

interface RoomDetailProps {
  roomId: string
  onBack: () => void
}

/**
 * WhatsApp number for inquiries (Centro NextHorizont Health).
 * Same number used by WhatsAppFloat and MobileStickyCTA — Evolution API
 * instance 'alma'. Hardcoded as constant to keep the helper free of env vars
 * (this is a frontend-only deploy without backend secrets management).
 */
const WHATSAPP_NUMBER = '34640056272'

function buildWhatsAppUrl(roomTitle: string) {
  const message = encodeURIComponent(
    `Hola, me interesa el programa "${roomTitle}" del Centro NextHorizont Health. ¿Pueden darme más información?`,
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}

export default function RoomDetail({ roomId, onBack }: RoomDetailProps) {
  const room = rooms.find((r) => r.id === roomId)
  const [hovered, setHovered] = useState(false)

  const handleReserve = () => {
    if (!room) return
    window.open(buildWhatsAppUrl(room.title), '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [roomId])

  if (!room) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          color: '#000000',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <p style={{ fontSize: '20px' }}>Programa no encontrado.</p>
        <button
          onClick={onBack}
          style={{
            fontSize: '13px',
            letterSpacing: '0.14em',
            padding: '14px 32px',
            border: '1px solid #000',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          ← Volver a programas
        </button>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Hero image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(400px, 70vh, 720px)',
          overflow: 'hidden',
          backgroundColor: '#0b0b0b',
        }}
      >
        <img
          src={room.img}
          alt={room.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 'clamp(100px, 14vh, 140px)',
            left: 'clamp(24px, 4vw, 60px)',
            fontSize: '12px',
            letterSpacing: '0.16em',
            padding: '12px 24px',
            border: '1px solid #ffffff',
            backgroundColor: 'rgba(0,0,0,0.35)',
            color: '#ffffff',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontFamily: '"Helvetica Neue", sans-serif',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          ← Volver
        </button>
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(32px, 5vw, 60px)',
            left: 'clamp(24px, 4vw, 60px)',
            right: 'clamp(24px, 4vw, 60px)',
            color: '#ffffff',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: 0.8,
              marginBottom: '12px',
            }}
          >
            Programa {room.id} · {room.client}
          </p>
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 80px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              margin: 0,
              maxWidth: '900px',
            }}
          >
            {room.title}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '80px clamp(24px, 4vw, 60px) 120px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(40px, 5vw, 80px)',
          alignItems: 'flex-start',
        }}
      >
        {/* Left: description + features */}
        <div style={{ flex: '2 1 600px', minWidth: 0 }}>
          <p
            style={{
              fontSize: 'clamp(20px, 2.2vw, 30px)',
              fontWeight: 400,
              lineHeight: 1.4,
              letterSpacing: '-0.015em',
              color: '#000000',
              marginBottom: '48px',
              maxWidth: '680px',
            }}
          >
            {room.tagline}
          </p>

          {room.description.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#333333',
                marginBottom: '24px',
                maxWidth: '680px',
              }}
            >
              {p}
            </p>
          ))}

          <div
            style={{
              marginTop: '64px',
              paddingTop: '32px',
              borderTop: '1px solid #1a1a1a',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: '#000000',
                textTransform: 'uppercase',
                marginBottom: '28px',
              }}
            >
              Características del programa
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '14px 40px',
              }}
            >
              {room.features.map((f) => (
                <li
                  key={f}
                  style={{
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: '#333333',
                    paddingLeft: '20px',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '12px',
                      width: '8px',
                      height: '1px',
                      backgroundColor: '#000000',
                    }}
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: booking panel */}
        <aside
          style={{
            flex: '1 1 320px',
            minWidth: 0,
            position: 'sticky',
            top: '112px',
            border: '1px solid #000000',
            padding: '32px 28px',
            backgroundColor: '#ffffff',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#666666',
              marginBottom: '12px',
            }}
          >
            Desde
          </p>
          <p
            style={{
              fontSize: 'clamp(36px, 4vw, 52px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#000000',
              marginBottom: '6px',
            }}
          >
            {room.price}
          </p>
          <p
            style={{
              fontSize: '13px',
              color: '#666666',
              lineHeight: 1.5,
              marginBottom: '28px',
            }}
          >
            {room.priceNote}
          </p>

          <dl
            style={{
              borderTop: '1px solid #e5e5e5',
              borderBottom: '1px solid #e5e5e5',
              padding: '16px 0',
              margin: '0 0 28px',
              display: 'grid',
              gap: '10px',
            }}
          >
            <Row k="Duración" v={room.sqm} />
            <Row k="Dirigido a" v={room.occupancy} />
            <Row k="Modalidad" v={room.bed} />
          </dl>

          <button
            onClick={handleReserve}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              width: '100%',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.16em',
              color: hovered ? '#ffffff' : '#000000',
              backgroundColor: hovered ? '#000000' : '#ffffff',
              border: '1px solid #000000',
              padding: '16px 24px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.25s ease',
              fontFamily: '"Helvetica Neue", sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            Pregúntanos por WhatsApp
          </button>
          <button
            onClick={onBack}
            style={{
              width: '100%',
              marginTop: '14px',
              fontSize: '12px',
              letterSpacing: '0.14em',
              color: '#666666',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontFamily: '"Helvetica Neue", sans-serif',
            }}
          >
            ← Volver a programas
          </button>
        </aside>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '13px',
        color: '#333333',
      }}
    >
      <dt style={{ color: '#666666' }}>{k}</dt>
      <dd style={{ margin: 0, fontWeight: 500, color: '#000000' }}>{v}</dd>
    </div>
  )
}
