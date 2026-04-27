import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  GraduationCap,
  Microscope,
  Stethoscope,
  Sparkles,
  Layers,
  Cpu,
  Award,
} from 'lucide-react'
import WordsPullUp from '../components/effects/WordsPullUp'
import { BentoGrid, BentoCard, BENTO_RESPONSIVE_CSS } from '../components/effects/BentoGrid'
import NumberTicker from '../components/effects/NumberTicker'

gsap.registerPlugin(ScrollTrigger)

/**
 * Quiénes Somos — about page for Centro NextHorizont Health.
 *
 * Editorial content adapted from a separate Kimi project ZIP that the user
 * uploaded. Selectively integrated: only the high-value differentiators,
 * doctor credentials, and KPIs were kept. Hero, footer, header,
 * preloader, login, and tRPC contact form from the ZIP were discarded
 * because they conflict with already-shipping equivalents in this project.
 *
 * Visual decisions:
 *   - Black hero (#0a0a0a) → light credentials section → black KPIs section
 *     → final CTA on light background. Three-band rhythm matches the home.
 *   - No 3D / Three.js (kept the page as editorial typography-driven content)
 *   - Reuses BentoGrid, NumberTicker, WordsPullUp from /components/effects/
 *   - Doctor photo loaded as <img loading="lazy" src=".webp"> with .jpg
 *     fallback for legacy Safari (via <picture>)
 *   - Final CTA scrolls to #precios on the home (handled via window.location)
 */

type DiffValue = {
  icon: React.ReactNode
  title: string
  detail: string
}

const DIFFERENTIATORS: DiffValue[] = [
  {
    icon: <Microscope size={28} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />,
    title: 'Rigor científico',
    detail:
      'Dirección médica con producción investigadora indexada en revistas internacionales de primer nivel: Chest, Critical Care Medicine, Resuscitation.',
  },
  {
    icon: <Stethoscope size={28} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />,
    title: 'Experiencia hospitalaria',
    detail:
      'Más de dos décadas en medicina crítica e intensiva, donde el margen de error es cero y cada decisión se basa en evidencia.',
  },
  {
    icon: <Sparkles size={28} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />,
    title: 'Innovación temprana',
    detail:
      'Pioneros en GLP-1 desde 2017, cuando la evidencia clínica empezaba a consolidarse a nivel internacional.',
  },
  {
    icon: <Award size={28} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />,
    title: 'Resultados reales',
    detail:
      'Más de 5.000 historias de éxito en pérdida de peso saludable y sostenible, con seguimiento personalizado a largo plazo.',
  },
  {
    icon: <Layers size={28} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />,
    title: 'Enfoque integral',
    detail:
      'No solo prescribimos: integramos farmacología, nutrición, conducta y seguimiento médico estricto en un programa único.',
  },
  {
    icon: <Cpu size={28} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />,
    title: 'Tecnología propia',
    detail:
      'Respaldados por NextHorizont AI, integrando inteligencia artificial al servicio del seguimiento clínico y la personalización.',
  },
]

type Credential = { title: string; detail: string }

const ACADEMIC_CREDENTIALS: Credential[] = [
  { title: 'Doctorado Suma Cum Laude', detail: 'Universidad de Granada' },
  { title: 'Premio Mejor Tesis Doctoral 2004', detail: 'Ilustre Colegio de Médicos de Almería' },
  { title: 'Beca Río Hortega · ISCIII', detail: 'Bio-nanoingeniería' },
  { title: 'Especialista en Medicina Intensiva', detail: 'Hospital Torrecárdenas' },
  { title: 'Visiting Professor', detail: 'Arizona State University · Bioengineering' },
  { title: 'Visiting Professor', detail: 'Georgia Tech · Physics of Soft Matter' },
]

const CLINICAL_ROLES: string[] = [
  'Director Médico Asistencial del Hospital de Poniente (El Ejido) y Hospital de Alta Resolución del Toyo (Almería)',
  'Director del Área Integrada de Cuidados Críticos y Urgencias · APHPO',
  'Responsable de UCI · Agencia Pública Hospital de Poniente',
]

const KPIS: { value: number; suffix?: string; prefix?: string; label: string }[] = [
  { value: 5000, prefix: '+', label: 'Pacientes tratados con éxito' },
  { value: 8, suffix: ' años', label: 'Innovando en GLP-1 desde 2017' },
  { value: 35, prefix: '+', label: 'Publicaciones científicas internacionales' },
  { value: 25, prefix: '+', suffix: ' años', label: 'En medicina hospitalaria' },
]

export default function QuienesSomos() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.from('.qs-fade-up', {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.qs-fade-up',
          start: 'top 85%',
          once: true,
        },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} style={{ backgroundColor: '#ffffff' }}>
      {/* HERO — black band */}
      <section
        style={{
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          padding: 'clamp(140px, 18vh, 200px) clamp(20px, 4vw, 60px) clamp(80px, 10vh, 120px)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              marginBottom: '28px',
              margin: 0,
              marginBlockEnd: '28px',
            }}
          >
            Sobre nosotros
          </p>
          <WordsPullUp
            text="Centro NextHorizont Health"
            as="h1"
            style={{
              fontSize: 'clamp(40px, 6.5vw, 88px)',
              fontWeight: 400,
              letterSpacing: '-0.035em',
              lineHeight: 1.02,
              color: '#ffffff',
              margin: 0,
              marginBlockEnd: '28px',
            }}
          />
          <p
            style={{
              fontSize: 'clamp(16px, 1.5vw, 20px)',
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '720px',
              margin: 0,
            }}
          >
            Una clínica fundada por especialistas en medicina crítica que, desde 2017, integran farmacología
            avanzada, nutrición personalizada y tecnología de IA para tratar la obesidad como lo que es: una
            enfermedad metabólica seria. En El Ejido, Almería.
          </p>
        </div>
      </section>

      {/* DIFFERENTIATORS — black band continues with bento grid */}
      <section
        style={{
          backgroundColor: '#0a0a0a',
          padding: 'clamp(60px, 8vh, 100px) clamp(20px, 4vw, 60px) clamp(120px, 14vh, 160px)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p
            className="qs-fade-up"
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
            Lo que nos diferencia
          </p>
          <h2
            className="qs-fade-up"
            style={{
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.08,
              color: '#ffffff',
              margin: 0,
              marginBlockEnd: '64px',
              maxWidth: '720px',
            }}
          >
            Seis pilares que definen nuestra forma de hacer medicina.
          </h2>

          <style>{BENTO_RESPONSIVE_CSS}</style>
          <BentoGrid>
            {DIFFERENTIATORS.map((d, i) => (
              <BentoCard key={d.title} colSpan={2} rowSpan={1} index={i}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {d.icon}
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 400,
                      color: '#ffffff',
                      margin: 0,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {d.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: 'rgba(255,255,255,0.72)',
                      margin: 0,
                    }}
                  >
                    {d.detail}
                  </p>
                </div>
              </BentoCard>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* DR. MARTÍNEZ ESCOBAR — light band, photo + credentials */}
      <section
        style={{
          backgroundColor: '#f4f4f5',
          padding: 'clamp(120px, 14vh, 160px) clamp(20px, 4vw, 60px)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p
            className="qs-fade-up"
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(0,0,0,0.5)',
              textTransform: 'uppercase',
              margin: 0,
              marginBlockEnd: '20px',
            }}
          >
            Dirección médica
          </p>
          <h2
            className="qs-fade-up"
            style={{
              fontSize: 'clamp(28px, 4.5vw, 56px)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#0a0a0a',
              margin: 0,
              marginBlockEnd: '60px',
              maxWidth: '720px',
            }}
          >
            Dr. Sergio Martínez Escobar
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
              gap: 'clamp(40px, 5vw, 80px)',
              alignItems: 'flex-start',
            }}
          >
            {/* Foto del Dr. con <picture> para fallback JPEG */}
            <div className="qs-fade-up">
              <picture>
                <source
                  srcSet="/quienes-somos/dr-martinez.webp"
                  type="image/webp"
                />
                <img
                  src="/quienes-somos/dr-martinez.jpg"
                  alt="Dr. Sergio Martínez Escobar — director médico de Centro NextHorizont Health"
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    aspectRatio: '1200 / 649',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.10)',
                  }}
                />
              </picture>
              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: '#666666',
                  margin: 0,
                  marginBlockStart: '20px',
                }}
              >
                Director Médico de Centro NextHorizont Health · Especialista en Medicina Intensiva · Doctor en
                Medicina por la Universidad de Granada (Suma Cum Laude).
              </p>
            </div>

            <div>
              <div
                className="qs-fade-up"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBlockEnd: '20px',
                }}
              >
                <GraduationCap size={20} color="#0a0a0a" strokeWidth={1.5} />
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#0a0a0a',
                    margin: 0,
                  }}
                >
                  Trayectoria académica
                </p>
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  marginBlockEnd: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {ACADEMIC_CREDENTIALS.map((c) => (
                  <li
                    key={c.title}
                    className="qs-fade-up"
                    style={{
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                      padding: '14px 0',
                    }}
                  >
                    <p style={{ fontSize: '15px', fontWeight: 500, color: '#0a0a0a', margin: 0 }}>
                      {c.title}
                    </p>
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#555555',
                        margin: 0,
                        marginBlockStart: '4px',
                      }}
                    >
                      {c.detail}
                    </p>
                  </li>
                ))}
              </ul>

              <div
                className="qs-fade-up"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBlockEnd: '20px',
                }}
              >
                <Stethoscope size={20} color="#0a0a0a" strokeWidth={1.5} />
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#0a0a0a',
                    margin: 0,
                  }}
                >
                  Cargos hospitalarios
                </p>
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {CLINICAL_ROLES.map((role) => (
                  <li
                    key={role}
                    className="qs-fade-up"
                    style={{
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                      padding: '14px 0',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      color: '#333333',
                    }}
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs — black band, big numbers */}
      <section
        style={{
          backgroundColor: '#0a0a0a',
          padding: 'clamp(100px, 12vh, 140px) clamp(20px, 4vw, 60px)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p
            className="qs-fade-up"
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              margin: 0,
              marginBlockEnd: '20px',
            }}
          >
            Rigor científico en números
          </p>
          <h2
            className="qs-fade-up"
            style={{
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.08,
              color: '#ffffff',
              margin: 0,
              marginBlockEnd: '60px',
              maxWidth: '720px',
            }}
          >
            La trayectoria detrás de cada consulta.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: 'clamp(32px, 4vw, 48px)',
            }}
          >
            {KPIS.map((kpi) => (
              <div
                key={kpi.label}
                className="qs-fade-up"
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.18)',
                  paddingBlockStart: '20px',
                }}
              >
                <NumberTicker
                  value={kpi.value}
                  prefix={kpi.prefix}
                  suffix={kpi.suffix}
                  style={{
                    fontSize: 'clamp(40px, 5vw, 64px)',
                    fontWeight: 400,
                    letterSpacing: '-0.025em',
                    lineHeight: 1,
                    color: '#ffffff',
                    display: 'block',
                  }}
                />
                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: 'rgba(255,255,255,0.65)',
                    margin: 0,
                    marginBlockStart: '14px',
                    maxWidth: '220px',
                  }}
                >
                  {kpi.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final — light band */}
      <section
        style={{
          backgroundColor: '#ffffff',
          padding: 'clamp(100px, 12vh, 140px) clamp(20px, 4vw, 60px)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2
            className="qs-fade-up"
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              color: '#0a0a0a',
              margin: 0,
              marginBlockEnd: '24px',
            }}
          >
            ¿Listo para empezar?
          </h2>
          <p
            className="qs-fade-up"
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#555555',
              margin: 0,
              marginBlockEnd: '40px',
            }}
          >
            La primera consulta incluye una evaluación clínica completa y un plan personalizado.
            Atención médica directa, sin formularios largos.
          </p>
          <div
            className="qs-fade-up"
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <a
              href="/#precios"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#ffffff',
                backgroundColor: '#0a0a0a',
                border: '1px solid #0a0a0a',
                borderRadius: '10px',
                textDecoration: 'none',
                fontFamily: '"Helvetica Neue", sans-serif',
                transition: 'transform 0.18s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
              }}
            >
              Ver planes y precios
            </a>
            <a
              href="https://wa.me/34640056272?text=Hola%2C%20vengo%20de%20la%20p%C3%A1gina%20Sobre%20Nosotros%20del%20Centro%20NextHorizont%20Health.%20Me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#0a0a0a',
                backgroundColor: 'transparent',
                border: '1px solid #0a0a0a',
                borderRadius: '10px',
                textDecoration: 'none',
                fontFamily: '"Helvetica Neue", sans-serif',
                transition: 'background-color 0.18s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(0,0,0,0.05)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'
              }}
            >
              Pregúntanos por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
