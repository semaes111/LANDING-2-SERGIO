import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useNavigate } from 'react-router'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;

void main() {
  vec2 coord = gl_FragCoord.xy / resolution;
  vec2 st = coord;
  coord *= 10.0;

  float len;
  for (int i = 0; i < 5; i++) {
    len = length(vec2(coord.x, coord.y));
    coord.x += cos(coord.y + sin(len)) + cos(time * 0.07) * 0.2;
    coord.y += sin(coord.x + cos(len)) + sin(time * 0.1);
  }

  len *= cos(len * 0.4);
  len -= 10.0;

  for (float i = 0.0; i < 5.0; i++) {
    len += 1.0 / abs(mod(st.x, 0.09 * i) * 200.0) * 1.0;
  }

  float r = cos(len + 0.2) * 0.4 + 0.5;
  float g = cos(len + 0.1) * 0.4 + 0.5;
  float b = cos(len - 0.05) * 0.45 + 0.55;

  vec3 color = vec3(r, g, b);
  color = smoothstep(0.1, 0.9, color);
  color *= 0.7;

  gl_FragColor = vec4(color, 1.0);
}
`

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const uniformsRef = useRef<{ resolution: THREE.Uniform; time: THREE.Uniform }>({
    resolution: new THREE.Uniform(new THREE.Vector2(1, 1)),
    time: new THREE.Uniform(0),
  })

  // Hover states for the two CTAs (primary registration, secondary WhatsApp).
  const [primaryHovered, setPrimaryHovered] = useState(false)
  const [secondaryHovered, setSecondaryHovered] = useState(false)

  const navigate = useNavigate()

  /**
   * Build the prefilled WhatsApp message for the secondary CTA.
   * The previous Hero collected name/email/phone/consultationType/message
   * via a 5-field form. After moving the registration funnel to /empezar
   * (which captures only name + phone for an Edge Function), the WhatsApp
   * fallback no longer has form data to serialize. The message is now a
   * plain greeting — the patient writes their question in WhatsApp itself.
   */
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      'Hola, me interesa Centro NextHorizont Health y querría preguntar por una consulta.',
    )
    const url = `https://wa.me/34640056272?text=${text}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvasHostRef.current
    if (!canvas || !host) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        resolution: uniformsRef.current.resolution,
        time: uniformsRef.current.time,
      },
      depthTest: false,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const handleResize = () => {
      const rect = host.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      renderer.setSize(w, h, false)
      uniformsRef.current.resolution.value.set(w, h)
    }
    handleResize()

    const ro = new ResizeObserver(handleResize)
    ro.observe(host)

    let rafId: number
    const startTime = performance.now()
    const animate = () => {
      uniformsRef.current.time.value = (performance.now() - startTime) / 1000
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '700px',
        backgroundColor: '#0b0b0b',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
      }}
    >
      {/* Left: shader */}
      <div
        ref={canvasHostRef}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '420px',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(24px, 4vw, 48px)',
            left: 'clamp(24px, 4vw, 48px)',
            right: 'clamp(24px, 4vw, 48px)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(36px, 4.5vw, 64px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              color: '#ffffff',
              marginBottom: '16px',
              textShadow: '0 2px 24px rgba(0,0,0,0.25)',
              maxWidth: '520px',
            }}
          >
            Reserva tu
            <br />
            consulta médica
          </h2>
          <p
            style={{
              fontSize: '13px',
              letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.9)',
              textTransform: 'uppercase',
            }}
          >
            NEXTHORIZONT · Consultas & Reservas
          </p>
        </div>
      </div>

      {/* Right: dual CTA (primary registration + secondary WhatsApp) */}
      <div
        style={{
          backgroundColor: '#0b0b0b',
          color: '#ffffff',
          padding: 'clamp(40px, 5vw, 72px) clamp(24px, 4vw, 60px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: '520px', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            Primera evaluación · Sin coste
          </p>
          <h3
            style={{
              fontSize: 'clamp(28px, 3.2vw, 40px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '20px',
              margin: 0,
            }}
          >
            Solicita tu consulta médica
          </h3>
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.78)',
              margin: 0,
              marginTop: '20px',
              marginBottom: '40px',
              maxWidth: '460px',
            }}
          >
            Te ayudamos a entender tu situación con un cuestionario clínico de 5 minutos.
            Después agendamos tu consulta.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Primary CTA: navigates to /empezar */}
            <button
              type="button"
              onClick={() => navigate('/empezar')}
              onMouseEnter={() => setPrimaryHovered(true)}
              onMouseLeave={() => setPrimaryHovered(false)}
              style={{
                padding: '20px 28px',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.16em',
                color: primaryHovered ? '#ffffff' : '#0b0b0b',
                backgroundColor: primaryHovered ? 'transparent' : '#ffffff',
                border: '1px solid #ffffff',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.25s ease',
                fontFamily: '"Helvetica Neue", sans-serif',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <span>Empezar evaluación gratis</span>
              <span aria-hidden="true">→</span>
            </button>

            {/* Secondary CTA: opens WhatsApp directly */}
            <button
              type="button"
              onClick={handleWhatsAppClick}
              onMouseEnter={() => setSecondaryHovered(true)}
              onMouseLeave={() => setSecondaryHovered(false)}
              style={{
                padding: '20px 28px',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.16em',
                color: secondaryHovered ? '#0b0b0b' : 'rgba(255,255,255,0.85)',
                backgroundColor: secondaryHovered ? '#ffffff' : 'transparent',
                border: '1px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.25s ease',
                fontFamily: '"Helvetica Neue", sans-serif',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              <span>Prefiero WhatsApp directo</span>
            </button>
          </div>

          {/* Reassurance row */}
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.05em',
              color: 'rgba(255,255,255,0.5)',
              marginTop: '32px',
              margin: 0,
              marginTop: '32px',
            }}
          >
            5 minutos · Tus datos cifrados · Sin compromiso
          </p>
        </div>
      </div>
    </section>
  )
}
