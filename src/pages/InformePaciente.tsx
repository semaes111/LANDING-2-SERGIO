import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  ShieldAlert,
  ArrowRight,
  Loader2,
  AlertOctagon,
} from 'lucide-react'
import WordsPullUp from '../components/effects/WordsPullUp'

gsap.registerPlugin(ScrollTrigger)

/**
 * /informe/:token — Patient-facing clinical recommendation report.
 *
 * Workflow:
 *   1. Patient receives a unique URL via WhatsApp/Telegram (sent by n8n
 *      after they complete the questionnaire).
 *   2. They click the link, browser navigates here.
 *   3. We extract :token from URL params.
 *   4. We call /api/informe?token=XXX (Vercel Edge Function).
 *   5. Edge Function validates token, increments view counter, returns JSON.
 *   6. We render one of FOUR visual states based on `informe.estado`:
 *        - 'verde'      → green: indication candidate
 *        - 'amarillo'   → yellow: candidate with caveats
 *        - 'rojo'       → red:    no pharmacological indication
 *        - 'incompleto' → grey:   missing data (e.g. no height)
 *   7. Or one of FIVE error states:
 *        - HTTP 400 (invalid token format)
 *        - HTTP 404 (token doesn't exist)
 *        - HTTP 410 (caducado / revocado)
 *        - HTTP 5xx or network failure
 *
 * Design decisions:
 *   - Same three-band rhythm as the rest of the site (black hero / white
 *     content / light grey CTA) but with the central content band
 *     dominating because the report itself is the entire purpose.
 *   - Status indicator uses the EXACT colors returned by the engine:
 *       #22c55e (verde), #eab308 (amarillo), #dc2626 (rojo), #94a3b8 (incompleto)
 *     The engine and frontend agree on these via informe.estado_color.
 *   - Watermark "DOCUMENTO ORIENTATIVO" is rendered as a subtle repeating
 *     pseudo-element behind content (NOT preventing readability, just
 *     framing the content as informative-only).
 *   - No download button. No print button. Print is explicitly suppressed
 *     via @media print { #nh-informe { display: none } } in a <style> tag
 *     so even Ctrl+P shows blank.
 *   - The full disclaimer (legal + automated) is shown in a dedicated
 *     prominent box at the end, NOT in fine print, because legal/medical
 *     constraints in Spain require this to be conspicuous.
 *   - CTA at the end is a single primary button to /empezar (or the same
 *     flow that books a consultation). The text comes from
 *     informe.cta_texto so the engine can adapt it per state.
 */

// ============================================================================
// Types matching the Edge Function response (api/informe.ts)
// ============================================================================

type Estado = 'verde' | 'amarillo' | 'rojo' | 'incompleto'

interface IndicacionDietetica {
  tipo_principal: string
  justificacion: string
  reevaluacion_meses: number
}

interface IndicacionGLP1 {
  procede_evaluar: boolean
  razonamiento: string
  grupos_terapeuticos: string[]
}

interface Secciones {
  tu_situacion: string
  hoja_de_ruta: string[]
  indicacion_dietetica: IndicacionDietetica
  indicacion_glp1: IndicacionGLP1
  puntos_consulta: string[]
}

interface Informe {
  paciente_nombre: string
  plan_tipo: 'free' | 'premium'
  generado_en: string
  bmi: number | null
  bmi_categoria: string | null
  estado: Estado
  estado_color: string
  estado_texto: string
  secciones: Secciones
  disclaimer_legal: string
  disclaimer_automatizado: string
  cta_texto: string
}

interface InformeResponse {
  ok: true
  informe: Informe
  metadata: {
    generado_en: string
    expira_en: string
    vistas_count: number
    primera_vista: boolean
  }
}

interface ErrorResponse {
  error: string
  motivo?: string
  expirado_en?: string
}

// ============================================================================
// Component
// ============================================================================

type FetchState =
  | { status: 'loading' }
  | { status: 'ok'; data: InformeResponse }
  | {
      status: 'error'
      kind:
        | 'invalid_format'
        | 'not_found'
        | 'expired'
        | 'revoked'
        | 'rate_limited'
        | 'server'
        | 'network'
      message: string
      detail?: string
    }

export default function InformePaciente() {
  const { token } = useParams<{ token: string }>()
  const [state, setState] = useState<FetchState>({ status: 'loading' })
  const sectionRef = useRef<HTMLDivElement>(null)

  // -------------------- Fetch the report on mount --------------------
  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!token || !/^[a-f0-9]{64}$/.test(token)) {
        if (!cancelled) {
          setState({
            status: 'error',
            kind: 'invalid_format',
            message: 'El enlace no es válido',
            detail:
              'El identificador del informe que aparece en la URL no tiene el formato esperado. Si copiaste y pegaste el enlace, comprueba que esté completo.',
          })
        }
        return
      }

      try {
        const res = await fetch(`/api/informe?token=${encodeURIComponent(token)}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })
        const data = (await res.json().catch(() => ({}))) as
          | InformeResponse
          | ErrorResponse

        if (cancelled) return

        if (res.ok && 'ok' in data && data.ok) {
          setState({ status: 'ok', data: data as InformeResponse })
          return
        }

        const err = data as ErrorResponse
        if (res.status === 400) {
          setState({
            status: 'error',
            kind: 'invalid_format',
            message: 'El enlace no es válido',
            detail: err.error || 'El formato del identificador es incorrecto.',
          })
        } else if (res.status === 404) {
          setState({
            status: 'error',
            kind: 'not_found',
            message: 'No encontramos este informe',
            detail:
              'El enlace puede ser incorrecto o el informe pudo haberse eliminado. Si recibiste esta URL hace tiempo, es posible que ya no esté disponible.',
          })
        } else if (res.status === 410) {
          // Could be expired OR revoked. Distinguish by `motivo`.
          if (err.motivo) {
            setState({
              status: 'error',
              kind: 'revoked',
              message: 'Este informe ya no está disponible',
              detail: err.motivo,
            })
          } else {
            setState({
              status: 'error',
              kind: 'expired',
              message: 'Este informe ha caducado',
              detail:
                'Por seguridad y privacidad, los informes son accesibles solo durante 7 días desde su generación. Si necesitas acceder de nuevo, podemos generar uno nuevo en tu próxima consulta.',
            })
          }
        } else if (res.status === 429) {
          setState({
            status: 'error',
            kind: 'rate_limited',
            message: 'Demasiados intentos',
            detail:
              'Has consultado este informe muchas veces en poco tiempo. Espera un minuto e inténtalo de nuevo.',
          })
        } else {
          setState({
            status: 'error',
            kind: 'server',
            message: 'Error al cargar el informe',
            detail:
              err.error ||
              'Hubo un problema al recuperar la información. Inténtalo en unos minutos.',
          })
        }
      } catch (e) {
        if (cancelled) return
        setState({
          status: 'error',
          kind: 'network',
          message: 'Sin conexión',
          detail:
            'No pudimos conectar con el servidor. Comprueba tu conexión a internet e inténtalo de nuevo.',
        })
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [token])

  // -------------------- Entrance animations once data is loaded --------------------
  useEffect(() => {
    if (state.status !== 'ok') return
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Fade up each card and section as they enter the viewport
      gsap.utils.toArray<HTMLElement>('.nh-fade-up').forEach((el) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      })
      // Refresh after layout settles
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 80)
      return () => window.clearTimeout(t)
    }, sectionRef)

    return () => ctx.revert()
  }, [state.status])

  // ============================================================================
  // RENDER BRANCHING
  // ============================================================================

  if (state.status === 'loading') {
    return <LoadingState />
  }

  if (state.status === 'error') {
    return (
      <ErrorState
        kind={state.kind}
        message={state.message}
        detail={state.detail}
      />
    )
  }

  return (
    <ReportContent
      sectionRef={sectionRef}
      data={state.data}
    />
  )
}

// ============================================================================
// Loading state
// ============================================================================

function LoadingState() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Loader2
          size={32}
          style={{
            color: 'rgba(255,255,255,0.7)',
            animation: 'nhInformeSpin 1.1s linear infinite',
            marginBottom: '20px',
          }}
        />
        <p
          style={{
            fontSize: '13px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            margin: 0,
          }}
        >
          Cargando informe…
        </p>
        <style>{`
          @keyframes nhInformeSpin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}

// ============================================================================
// Error state (5 variants)
// ============================================================================

function ErrorState({
  kind,
  message,
  detail,
}: {
  kind:
    | 'invalid_format'
    | 'not_found'
    | 'expired'
    | 'revoked'
    | 'rate_limited'
    | 'server'
    | 'network'
  message: string
  detail?: string
}) {
  // Choose icon by error kind. Same icon family as the report states for
  // visual coherence.
  const Icon =
    kind === 'expired'
      ? AlertOctagon
      : kind === 'revoked'
        ? ShieldAlert
        : kind === 'rate_limited'
          ? Info
          : kind === 'network'
            ? Info
            : XCircle

  // For expired: nudge them to book; for everything else: send to home.
  const ctaText = kind === 'expired' ? 'Reservar consulta' : 'Volver al inicio'
  const ctaHref = kind === 'expired' ? '/empezar' : '/'

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            marginBottom: '24px',
          }}
        >
          <Icon size={28} style={{ color: 'rgba(255,255,255,0.78)' }} />
        </div>
        <h1
          style={{
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            margin: '0 0 16px',
          }}
        >
          {message}
        </h1>
        {detail && (
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.65)',
              margin: '0 0 32px',
            }}
          >
            {detail}
          </p>
        )}
        <Link
          to={ctaHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            backgroundColor: '#ffffff',
            color: '#0a0a0a',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.02em',
            borderRadius: '999px',
            transition: 'transform 0.18s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = 'translateY(-1px)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = 'translateY(0)')
          }
        >
          {ctaText}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

// ============================================================================
// Helpers for the report
// ============================================================================

function StatusIcon({ estado }: { estado: Estado }) {
  if (estado === 'verde') return <CheckCircle2 size={28} />
  if (estado === 'amarillo') return <AlertTriangle size={28} />
  if (estado === 'rojo') return <XCircle size={28} />
  return <Info size={28} />
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

// ============================================================================
// Main report content
// ============================================================================

function ReportContent({
  sectionRef,
  data,
}: {
  sectionRef: React.RefObject<HTMLDivElement | null>
  data: InformeResponse
}) {
  const { informe, metadata } = data
  const estadoColor = informe.estado_color
  const estado = informe.estado

  // Convert hex to rgba helper (for status backgrounds)
  const rgbaFromHex = (hex: string, alpha: number) => {
    const m = hex.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    if (!m) return hex
    const r = parseInt(m[1], 16)
    const g = parseInt(m[2], 16)
    const b = parseInt(m[3], 16)
    return `rgba(${r},${g},${b},${alpha})`
  }

  return (
    <div
      ref={sectionRef}
      id="nh-informe"
      style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}
    >
      {/* Print-blocking + watermark style */}
      <style>{`
        @media print {
          #nh-informe { display: none !important; }
          body::after {
            content: 'DOCUMENTO ORIENTATIVO — NO VÁLIDO PARA IMPRESIÓN';
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #555;
            background: #fff;
            z-index: 999999;
          }
        }
        /* Disable text selection of disclaimers to discourage out-of-context copy.
           Patient can still read normally; we only stop selection of the legal text. */
        .nh-no-select { user-select: none; -webkit-user-select: none; }
      `}</style>

      {/* ============= BAND 1: HERO (black) ============= */}
      <section
        style={{
          minHeight: '64vh',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          padding:
            'clamp(120px, 14vw, 180px) clamp(20px, 6vw, 80px) clamp(64px, 8vw, 100px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Watermark */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage:
              'repeating-linear-gradient(-32deg, transparent 0 200px, rgba(255,255,255,0.018) 200px 280px)',
            zIndex: 0,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-18deg)',
            fontSize: 'clamp(60px, 10vw, 140px)',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.025)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          DOCUMENTO ORIENTATIVO
        </div>

        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.24em',
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              margin: 0,
              marginBottom: '20px',
            }}
          >
            Informe orientativo para {informe.paciente_nombre}
          </p>

          <WordsPullUp
            text={informe.estado_texto}
            className="nh-status-headline"
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(30px, 4.6vw, 52px)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.12,
              margin: '0 0 28px',
              color: '#ffffff',
            }}
          />

          {/* Status badge */}
          <div
            className="nh-fade-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              borderRadius: '999px',
              backgroundColor: rgbaFromHex(estadoColor, 0.14),
              border: `1px solid ${rgbaFromHex(estadoColor, 0.45)}`,
              color: estadoColor,
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              marginBottom: '32px',
            }}
          >
            <StatusIcon estado={estado} />
            <span style={{ textTransform: 'uppercase' }}>Estado: {estado}</span>
          </div>

          {/* IMC + plan */}
          <div
            className="nh-fade-up"
            style={{
              display: 'flex',
              gap: 'clamp(20px, 4vw, 40px)',
              flexWrap: 'wrap',
              marginTop: '8px',
            }}
          >
            {informe.bmi !== null && (
              <div>
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                    margin: 0,
                    marginBottom: '6px',
                  }}
                >
                  IMC
                </p>
                <p
                  style={{
                    fontSize: '22px',
                    fontWeight: 400,
                    margin: 0,
                    color: '#ffffff',
                  }}
                >
                  {informe.bmi.toFixed(1)}{' '}
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
                    {informe.bmi_categoria}
                  </span>
                </p>
              </div>
            )}
            <div>
              <p
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  margin: 0,
                  marginBottom: '6px',
                }}
              >
                Plan
              </p>
              <p
                style={{
                  fontSize: '22px',
                  fontWeight: 400,
                  margin: 0,
                  color: '#ffffff',
                  textTransform: 'capitalize',
                }}
              >
                {informe.plan_tipo}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  margin: 0,
                  marginBottom: '6px',
                }}
              >
                Generado
              </p>
              <p
                style={{
                  fontSize: '22px',
                  fontWeight: 400,
                  margin: 0,
                  color: '#ffffff',
                }}
              >
                {formatDate(metadata.generado_en)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============= BAND 2: CONTENT (white) ============= */}
      <section
        style={{
          backgroundColor: '#ffffff',
          color: '#0a0a0a',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* TU SITUACIÓN */}
          <div className="nh-fade-up" style={{ marginBottom: '64px' }}>
            <SectionLabel>Tu situación</SectionLabel>
            <p
              style={{
                fontSize: 'clamp(17px, 1.8vw, 19px)',
                lineHeight: 1.65,
                color: '#1a1a1a',
                margin: 0,
                fontWeight: 300,
              }}
            >
              {informe.secciones.tu_situacion}
            </p>
          </div>

          {/* HOJA DE RUTA */}
          <div className="nh-fade-up" style={{ marginBottom: '64px' }}>
            <SectionLabel>Hoja de ruta</SectionLabel>
            <ol
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                counterReset: 'nh-step',
              }}
            >
              {informe.secciones.hoja_de_ruta.map((paso, i) => (
                <li
                  key={i}
                  style={{
                    position: 'relative',
                    paddingLeft: '60px',
                    paddingTop: '18px',
                    paddingBottom: '18px',
                    borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.08)',
                    fontSize: '16px',
                    lineHeight: 1.55,
                    color: '#1a1a1a',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '20px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: rgbaFromHex(estadoColor, 0.12),
                      border: `1px solid ${rgbaFromHex(estadoColor, 0.4)}`,
                      color: estadoColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {i + 1}
                  </span>
                  {paso}
                </li>
              ))}
            </ol>
          </div>

          {/* INDICACIÓN DIETÉTICA */}
          <div
            className="nh-fade-up"
            style={{
              marginBottom: '32px',
              padding: 'clamp(28px, 4vw, 40px)',
              backgroundColor: '#f4f4f5',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.55)',
                margin: 0,
                marginBottom: '10px',
                fontWeight: 500,
              }}
            >
              Indicación dietética
            </p>
            <h3
              style={{
                fontSize: 'clamp(22px, 3vw, 28px)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                margin: '0 0 16px',
                color: '#0a0a0a',
                textTransform: 'capitalize',
              }}
            >
              {informe.secciones.indicacion_dietetica.tipo_principal}
            </h3>
            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: '#1a1a1a',
                margin: '0 0 16px',
                fontWeight: 300,
              }}
            >
              {informe.secciones.indicacion_dietetica.justificacion}
            </p>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(0,0,0,0.6)',
                margin: 0,
                letterSpacing: '0.04em',
              }}
            >
              Reevaluación recomendada en{' '}
              {informe.secciones.indicacion_dietetica.reevaluacion_meses}{' '}
              {informe.secciones.indicacion_dietetica.reevaluacion_meses === 1
                ? 'mes'
                : 'meses'}
            </p>
          </div>

          {/* INDICACIÓN GLP-1 */}
          <div
            className="nh-fade-up"
            style={{
              marginBottom: '64px',
              padding: 'clamp(28px, 4vw, 40px)',
              backgroundColor: rgbaFromHex(estadoColor, 0.06),
              borderRadius: '16px',
              border: `1px solid ${rgbaFromHex(estadoColor, 0.25)}`,
            }}
          >
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: estadoColor,
                margin: 0,
                marginBottom: '10px',
                fontWeight: 600,
              }}
            >
              Posibilidad de tratamiento farmacológico
            </p>
            <p
              style={{
                fontSize: 'clamp(15px, 1.6vw, 17px)',
                lineHeight: 1.65,
                color: '#1a1a1a',
                margin: 0,
                fontWeight: 300,
              }}
            >
              {informe.secciones.indicacion_glp1.razonamiento}
            </p>

            {informe.secciones.indicacion_glp1.grupos_terapeuticos.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(0,0,0,0.55)',
                    margin: 0,
                    marginBottom: '12px',
                    fontWeight: 500,
                  }}
                >
                  Grupo terapéutico mencionado
                </p>
                <div
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                >
                  {informe.secciones.indicacion_glp1.grupos_terapeuticos.map(
                    (g, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '8px 14px',
                          fontSize: '13px',
                          backgroundColor: '#ffffff',
                          color: '#0a0a0a',
                          border: '1px solid rgba(0,0,0,0.12)',
                          borderRadius: '999px',
                        }}
                      >
                        {g}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PUNTOS PARA TU CONSULTA */}
          <div className="nh-fade-up" style={{ marginBottom: '64px' }}>
            <SectionLabel>Puntos para tu consulta</SectionLabel>
            <ul
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              {informe.secciones.puntos_consulta.map((p, i) => (
                <li
                  key={i}
                  style={{
                    position: 'relative',
                    paddingLeft: '32px',
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.08)',
                    fontSize: '16px',
                    lineHeight: 1.55,
                    color: '#1a1a1a',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '22px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: estadoColor,
                    }}
                  />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* DISCLAIMERS */}
          <div
            className="nh-fade-up nh-no-select"
            style={{
              padding: 'clamp(24px, 3vw, 32px)',
              backgroundColor: '#fafafa',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.08)',
              marginBottom: '40px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <ShieldAlert
                size={18}
                style={{
                  color: 'rgba(0,0,0,0.5)',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: 'rgba(0,0,0,0.7)',
                    margin: '0 0 12px',
                  }}
                >
                  {informe.disclaimer_legal}
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: 'rgba(0,0,0,0.7)',
                    margin: 0,
                  }}
                >
                  {informe.disclaimer_automatizado}
                </p>
              </div>
            </div>
          </div>

          {/* META: vistas + caduca */}
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.4)',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Caduca el {formatDate(metadata.expira_en)}
            {metadata.vistas_count > 1 &&
              ` · ${metadata.vistas_count} consultas`}
          </p>
        </div>
      </section>

      {/* ============= BAND 3: CTA (light grey) ============= */}
      <section
        style={{
          backgroundColor: '#f4f4f5',
          padding: 'clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2
            className="nh-fade-up"
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: '#0a0a0a',
              margin: '0 0 20px',
            }}
          >
            {informe.cta_texto}
          </h2>
          <p
            className="nh-fade-up"
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'rgba(0,0,0,0.65)',
              margin: '0 0 36px',
              fontWeight: 300,
            }}
          >
            La información de este informe debe ser revisada por un facultativo
            en el contexto de una consulta presencial. Reserva tu cita y trae
            este informe contigo.
          </p>
          <Link
            to="/empezar"
            className="nh-fade-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              backgroundColor: '#0a0a0a',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
              letterSpacing: '0.02em',
              borderRadius: '999px',
              transition: 'transform 0.18s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'translateY(-1px)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'translateY(0)')
            }
          >
            Reservar consulta
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}

// ============================================================================
// Small subcomponents
// ============================================================================

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.24em',
        color: 'rgba(0,0,0,0.55)',
        textTransform: 'uppercase',
        margin: 0,
        marginBottom: '18px',
      }}
    >
      {children}
    </p>
  )
}
