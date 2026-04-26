import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Stethoscope, Syringe, BrainCog, GraduationCap, Activity, Video, Bot, Smartphone } from 'lucide-react'
import { BentoGrid, BentoCard, BENTO_RESPONSIVE_CSS } from '../components/effects/BentoGrid'
import WeightLossChart from '../components/effects/WeightLossChart'

// Bento Grid layout — 4 columns × variable rows. Each card declares colSpan/rowSpan.
// Asymmetric layout: hero card (Reset Metabólico 90D) takes 2x2, others fill around.

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0b0b0b',
        padding: 'clamp(100px, 12vw, 160px) clamp(20px, 4vw, 60px)',
      }}
    >
      <img
        src="/images/equipo-medico.jpg"
        alt="Equipo médico de Centro NextHorizont Health en reunión clínica"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Top: title row */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(32px, 6vw, 80px)',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginBottom: '60px',
            paddingBottom: '28px',
            borderBottom: '1px solid rgba(255,255,255,0.35)',
          }}
        >
          <div style={{ flex: '1 1 500px' }}>
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.24em',
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'uppercase',
                marginBottom: '18px',
              }}
            >
              Qué ofrecemos
            </p>
            <h2
              style={{
                fontSize: 'clamp(40px, 6vw, 80px)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: '#ffffff',
                marginBottom: '24px',
              }}
            >
              Servicios Clínicos
            </h2>
            <p
              style={{
                fontSize: 'clamp(15px, 1.2vw, 18px)',
                fontWeight: 300,
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.78)',
                maxWidth: '640px',
              }}
            >
              Desde la primera consulta médica hasta el seguimiento a largo plazo, cada servicio de Centro NextHorizont Health está diseñado con rigor clínico y tecnología responsable. Un resumen de lo que ofrecemos a pacientes y profesionales:
            </p>
          </div>
          <div
            style={{
              flex: '0 0 clamp(180px, 22vw, 280px)',
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <OrbitalBadge />
          </div>
        </div>

        {/* Bento Grid — asymmetric layout */}
        <style>{BENTO_RESPONSIVE_CSS}</style>
        <BentoGrid>
          {/* Hero card: Reset Metabólico — 2x2 (the flagship product) */}
          <BentoCard colSpan={2} rowSpan={2} index={0}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
              <Syringe size={32} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
              <div>
                <h3 style={{ fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 400, color: '#ffffff', margin: 0, marginBottom: '12px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Reset Metabólico 90 días
                </h3>
                <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(255,255,255,0.72)', margin: 0 }}>
                  Programa integral con GLP-1 (Wegovy/Mounjaro), nutrición personalizada y seguimiento médico continuo. Diseñado para resultados sostenibles a 12+ meses.
                </p>
              </div>
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <p
                  style={{
                    fontSize: '10px',
                    fontWeight: 500,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.45)',
                    margin: '0 0 4px',
                  }}
                >
                  Pérdida prevista — 12 semanas
                </p>
                <WeightLossChart startWeight={100} totalLoss={12} />
                <p
                  style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.45)',
                    fontStyle: 'italic',
                    margin: '4px 0 0',
                    lineHeight: 1.3,
                  }}
                >
                  Datos representativos basados en ensayos STEP-1/SURMOUNT-1. Resultados individuales varían.
                </p>
              </div>
            </div>
          </BentoCard>

          {/* Consulta GLP-1 — 2x1 */}
          <BentoCard colSpan={2} rowSpan={1} index={1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Stethoscope size={28} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
              <h3 style={{ fontSize: '20px', fontWeight: 400, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                Consulta GLP-1
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Primera visita con evaluación de candidatura y prescripción individualizada. Desde 99€.
              </p>
            </div>
          </BentoCard>

          {/* Telemedicina — 1x1 */}
          <BentoCard colSpan={1} rowSpan={1} index={2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
              <Video size={26} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
              <div style={{ marginTop: 'auto' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 400, color: '#ffffff', margin: 0, marginBottom: '6px' }}>
                  Telemedicina
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.45, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                  Online o presencial.
                </p>
              </div>
            </div>
          </BentoCard>

          {/* IA Clínica — 1x1 */}
          <BentoCard colSpan={1} rowSpan={1} index={3}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
              <Bot size={26} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
              <div style={{ marginTop: 'auto' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 400, color: '#ffffff', margin: 0, marginBottom: '6px' }}>
                  IA clínica
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.45, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                  Pre-consulta y dashboards.
                </p>
              </div>
            </div>
          </BentoCard>

          {/* Membership Reset — 2x1 */}
          <BentoCard colSpan={2} rowSpan={1} index={4}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Activity size={28} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
              <h3 style={{ fontSize: '20px', fontWeight: 400, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                Membership Reset
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Revisión mensual, ajuste de dosis, app de seguimiento y WhatsApp directo. 79€/mes.
              </p>
            </div>
          </BentoCard>

          {/* Cursos de Nutrición — 2x1 */}
          <BentoCard colSpan={2} rowSpan={1} index={5}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <GraduationCap size={28} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
              <h3 style={{ fontSize: '20px', fontWeight: 400, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                Cursos de nutrición
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Formación clínica basada en evidencia. Acceso al campus en cursos.nexthorizont.com.
              </p>
            </div>
          </BentoCard>

          {/* Formación Médica — 1x1 */}
          <BentoCard colSpan={1} rowSpan={1} index={6}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
              <BrainCog size={26} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
              <div style={{ marginTop: 'auto' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 400, color: '#ffffff', margin: 0, marginBottom: '6px' }}>
                  Formación
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.45, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                  Para profesionales.
                </p>
              </div>
            </div>
          </BentoCard>

          {/* App móvil — 1x1 */}
          <BentoCard colSpan={1} rowSpan={1} index={7}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
              <Smartphone size={26} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
              <div style={{ marginTop: 'auto' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 400, color: '#ffffff', margin: 0, marginBottom: '6px' }}>
                  App móvil
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.45, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                  Próximamente.
                </p>
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </section>
  )
}

function OrbitalBadge() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const pathId = `orbital-path-${Math.floor(Math.random() * 10000)}`
    const duration = 25

    const path = svg.querySelector('path')
    if (!path) return

    path.setAttribute('id', pathId)
    path.setAttribute('fill', 'none')

    const textContent = 'NEXTHORIZONT \u2022 SALUD METABOLICA \u2022 CENTRO NEXTHORIZONT HEALTH \u2022 '

    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textEl.setAttribute('fill', '#ffffff')
    textEl.setAttribute('font-family', "'Helvetica Neue', sans-serif")
    textEl.setAttribute('font-size', '18px')
    textEl.setAttribute('font-weight', '500')
    textEl.setAttribute('letter-spacing', '2px')

    const tp1 = document.createElementNS('http://www.w3.org/2000/svg', 'textPath')
    tp1.setAttribute('href', `#${pathId}`)
    tp1.setAttribute('startOffset', '0%')
    tp1.textContent = textContent

    const tp2 = document.createElementNS('http://www.w3.org/2000/svg', 'textPath')
    tp2.setAttribute('href', `#${pathId}`)
    tp2.setAttribute('startOffset', '0%')
    tp2.textContent = textContent

    textEl.appendChild(tp1)
    textEl.appendChild(tp2)
    svg.appendChild(textEl)

    const textPaths = svg.querySelectorAll('textPath')

    const tween1 = gsap.fromTo(
      textPaths[0],
      { attr: { startOffset: '0%' } },
      { attr: { startOffset: '-100%' }, duration, ease: 'none', repeat: -1 }
    )

    const tween2 = gsap.fromTo(
      textPaths[1],
      { attr: { startOffset: '100%' } },
      { attr: { startOffset: '0%' }, duration, ease: 'none', repeat: -1 }
    )

    return () => {
      tween1.kill()
      tween2.kill()
    }
  }, [])

  return (
    <div
      className="orbital-svg-container"
      style={{
        width: '100%',
        height: '100%',
        transform: 'rotate(-15deg)',
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        style={{ width: '100%', height: '100%' }}
      >
        <path
          d="M200,40 A160,160 0 1,1 199.99,40"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.5"
          opacity="0.25"
        />
      </svg>
    </div>
  )
}
