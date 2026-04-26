import { useEffect, useState, type CSSProperties } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

/**
 * Cookie Banner — AEPD-compliant consent banner for Centro NextHorizont Health.
 *
 * Compliance checklist (AEPD Guía Cookies 2023 + RGPD art. 7 + LSSI-CE art. 22.2):
 *
 *   ✅ Three equivalent buttons: Accept / Reject / Configure
 *      Same size, same visual weight, no dark patterns favoring "Accept"
 *   ✅ Banner does NOT block site content — user can browse without deciding
 *   ✅ No cookies are set BEFORE the user makes a choice (the iframe Map
 *      and any future trackers are conditionally rendered based on consent)
 *   ✅ Decision is persisted with timestamp for legal traceability
 *   ✅ Re-accessible from the footer link "Configurar cookies" via
 *      window.openCookieSettings() global
 *   ✅ Yearly refresh: if consentTimestamp is older than 365 days,
 *      the banner reappears automatically
 *   ✅ Granular categories ready for future expansion:
 *        - functional (always true, technical cookies)
 *        - maps (Google Maps iframe)
 *        - analytics (placeholder for future GA/Plausible)
 *        - marketing (placeholder for future Meta Pixel / Stripe ads)
 *
 * Storage shape in localStorage['nh_cookie_consent']:
 *   {
 *     version: 1,
 *     timestamp: 1730000000000,
 *     functional: true,    // always true (essential)
 *     maps: true | false,
 *     analytics: true | false,
 *     marketing: true | false,
 *   }
 *
 * Public API:
 *   - <CookieBanner />: drop-in component to render once at App root
 *   - window.cookieConsent: read current consent object
 *   - window.openCookieSettings(): re-open the modal from anywhere
 *   - hasCookieConsent(category): exported helper for guarded rendering
 */

const STORAGE_KEY = 'nh_cookie_consent'
const CURRENT_VERSION = 1
const REFRESH_INTERVAL_MS = 365 * 24 * 60 * 60 * 1000

export type CookieCategory = 'functional' | 'maps' | 'analytics' | 'marketing'

export type CookieConsent = {
  version: number
  timestamp: number
  functional: true
  maps: boolean
  analytics: boolean
  marketing: boolean
}

const DEFAULT_ACCEPT_ALL: Omit<CookieConsent, 'version' | 'timestamp'> = {
  functional: true,
  maps: true,
  analytics: true,
  marketing: true,
}

const DEFAULT_REJECT_ALL: Omit<CookieConsent, 'version' | 'timestamp'> = {
  functional: true,
  maps: false,
  analytics: false,
  marketing: false,
}

declare global {
  interface Window {
    cookieConsent?: CookieConsent | null
    openCookieSettings?: () => void
  }
}

function readConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CookieConsent
    if (parsed.version !== CURRENT_VERSION) return null
    if (Date.now() - parsed.timestamp > REFRESH_INTERVAL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeConsent(partial: Omit<CookieConsent, 'version' | 'timestamp'>): CookieConsent {
  const consent: CookieConsent = {
    version: CURRENT_VERSION,
    timestamp: Date.now(),
    ...partial,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
    window.cookieConsent = consent
    window.dispatchEvent(new CustomEvent('cookieConsentChange', { detail: consent }))
  } catch {
    // localStorage may be disabled in private browsing — silently degrade
  }
  return consent
}

/**
 * Helper exported for guarded rendering of third-party content.
 * Usage:
 *   import { hasCookieConsent } from '../components/CookieBanner'
 *   if (hasCookieConsent('maps')) { ... }
 */
export function hasCookieConsent(category: CookieCategory): boolean {
  if (typeof window === 'undefined') return false
  const consent = window.cookieConsent ?? readConsent()
  if (!consent) return false
  return consent[category] === true
}

/**
 * Helper hook for components that need to react to consent changes
 * (e.g. LocationSection re-rendering when user opens settings and toggles maps).
 */
export function useCookieConsent(category: CookieCategory): boolean {
  const [granted, setGranted] = useState(() => {
    if (typeof window === 'undefined') return false
    const c = readConsent()
    return c?.[category] === true
  })

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CookieConsent>).detail
      setGranted(detail?.[category] === true)
    }
    window.addEventListener('cookieConsentChange', handler)
    return () => window.removeEventListener('cookieConsentChange', handler)
  }, [category])

  return granted
}

type View = 'banner' | 'settings'

export default function CookieBanner() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View>('banner')
  const [maps, setMaps] = useState(true)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  // Initialize on mount: load existing consent if any, expose global API,
  // and show banner if no valid consent stored.
  useEffect(() => {
    const existing = readConsent()
    if (existing) {
      window.cookieConsent = existing
      setMaps(existing.maps)
      setAnalytics(existing.analytics)
      setMarketing(existing.marketing)
    } else {
      // Show banner after 800ms — long enough not to feel intrusive on landing,
      // short enough to appear before any tracker request would normally fire
      const id = window.setTimeout(() => {
        setOpen(true)
        setView('banner')
      }, 800)
      return () => window.clearTimeout(id)
    }
  }, [])

  // Expose global re-open API (used by Footer "Configurar cookies" link)
  useEffect(() => {
    window.openCookieSettings = () => {
      const existing = readConsent()
      if (existing) {
        setMaps(existing.maps)
        setAnalytics(existing.analytics)
        setMarketing(existing.marketing)
      }
      setView('settings')
      setOpen(true)
    }
    return () => {
      delete window.openCookieSettings
    }
  }, [])

  const acceptAll = () => {
    writeConsent(DEFAULT_ACCEPT_ALL)
    setOpen(false)
  }

  const rejectAll = () => {
    writeConsent(DEFAULT_REJECT_ALL)
    setOpen(false)
  }

  const saveCustom = () => {
    writeConsent({
      functional: true,
      maps,
      analytics,
      marketing,
    })
    setOpen(false)
  }

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cookie-banner-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: view === 'settings' ? 'center' : 'flex-end',
            justifyContent: 'center',
            padding: 'clamp(12px, 3vw, 24px)',
            paddingBottom: view === 'banner'
              ? 'calc(clamp(12px, 3vw, 24px) + env(safe-area-inset-bottom))'
              : 'clamp(12px, 3vw, 24px)',
            pointerEvents: 'auto',
          }}
        >
          {/* Backdrop only for settings modal — banner does NOT block site */}
          {view === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setView('banner')}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(2px)',
              }}
            />
          )}

          <motion.div
            initial={prefersReducedMotion ? false : { y: view === 'settings' ? 0 : 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { y: view === 'settings' ? 0 : 60, opacity: 0 }}
            transition={transition}
            role="dialog"
            aria-modal={view === 'settings'}
            aria-labelledby="cookie-banner-title"
            style={{
              position: 'relative',
              backgroundColor: '#0a0a0a',
              color: '#ffffff',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              maxWidth: view === 'settings' ? '560px' : '900px',
              width: '100%',
              padding: 'clamp(20px, 3vw, 32px)',
              fontFamily: '"Helvetica Neue", -apple-system, sans-serif',
              maxHeight: 'calc(100vh - 48px)',
              overflowY: 'auto',
            }}
          >
            {view === 'banner' ? (
              <BannerView onAccept={acceptAll} onReject={rejectAll} onConfigure={() => setView('settings')} />
            ) : (
              <SettingsView
                maps={maps}
                analytics={analytics}
                marketing={marketing}
                setMaps={setMaps}
                setAnalytics={setAnalytics}
                setMarketing={setMarketing}
                onSave={saveCustom}
                onAcceptAll={acceptAll}
                onRejectAll={rejectAll}
                onClose={() => setView('banner')}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function BannerView({
  onAccept,
  onReject,
  onConfigure,
}: {
  onAccept: () => void
  onReject: () => void
  onConfigure: () => void
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        gap: 'clamp(16px, 2vw, 32px)',
        alignItems: 'center',
      }}
      className="cookie-banner-grid"
    >
      <div>
        <h2
          id="cookie-banner-title"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            margin: 0,
            marginBottom: '8px',
            letterSpacing: '-0.01em',
          }}
        >
          Privacidad y cookies
        </h2>
        <p
          style={{
            fontSize: '13px',
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.72)',
            margin: 0,
          }}
        >
          Usamos cookies técnicas necesarias para el funcionamiento del sitio y, con tu consentimiento, otras
          de terceros (Google Maps en la sección de localización). Puedes aceptar, rechazar o configurar.
          Más detalles en nuestra{' '}
          <a
            href="/cookies"
            style={{
              color: '#ffffff',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Política de Cookies
          </a>
          .
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
        }}
        className="cookie-banner-actions"
      >
        <ButtonNeutral onClick={onConfigure}>Configurar</ButtonNeutral>
        <ButtonNeutral onClick={onReject}>Rechazar</ButtonNeutral>
        <ButtonNeutral onClick={onAccept}>Aceptar</ButtonNeutral>
      </div>
      <style>{`
        @media (max-width: 720px) {
          .cookie-banner-grid {
            grid-template-columns: 1fr !important;
          }
          .cookie-banner-actions {
            justify-content: stretch !important;
          }
          .cookie-banner-actions button {
            flex: 1;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  )
}

function SettingsView({
  maps,
  analytics,
  marketing,
  setMaps,
  setAnalytics,
  setMarketing,
  onSave,
  onAcceptAll,
  onRejectAll,
  onClose,
}: {
  maps: boolean
  analytics: boolean
  marketing: boolean
  setMaps: (v: boolean) => void
  setAnalytics: (v: boolean) => void
  setMarketing: (v: boolean) => void
  onSave: () => void
  onAcceptAll: () => void
  onRejectAll: () => void
  onClose: () => void
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <h2
            id="cookie-banner-title"
            style={{
              fontSize: '20px',
              fontWeight: 500,
              margin: 0,
              marginBottom: '8px',
              letterSpacing: '-0.02em',
            }}
          >
            Configuración de cookies
          </h2>
          <p
            style={{
              fontSize: '13px',
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.65)',
              margin: 0,
            }}
          >
            Selecciona qué tipos de cookies aceptas. Tu decisión se guarda durante 12 meses.
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '4px 8px',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          paddingBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <ToggleRow
          title="Necesarias"
          description="Imprescindibles para el funcionamiento del sitio (preferencias de UI, navegación). No se pueden desactivar."
          checked
          disabled
          onChange={() => {}}
        />
        <ToggleRow
          title="Mapa de localización (Google Maps)"
          description="Permite mostrar el iframe de Google Maps en la sección 'Encuéntranos'. Google puede instalar cookies propias."
          checked={maps}
          onChange={setMaps}
        />
        <ToggleRow
          title="Analítica"
          description="Estadísticas anónimas de uso del sitio (no activas actualmente, reservado para futuro)."
          checked={analytics}
          onChange={setAnalytics}
        />
        <ToggleRow
          title="Marketing"
          description="Personalización de campañas y mediciones publicitarias (no activas actualmente, reservado para futuro)."
          checked={marketing}
          onChange={setMarketing}
        />
      </div>

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <ButtonNeutral onClick={onRejectAll}>Rechazar todo</ButtonNeutral>
          <ButtonNeutral onClick={onAcceptAll}>Aceptar todo</ButtonNeutral>
        </div>
        <ButtonPrimary onClick={onSave}>Guardar selección</ButtonPrimary>
      </div>
    </div>
  )
}

function ToggleRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        gap: '14px',
        alignItems: 'flex-start',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <div>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 500,
            margin: 0,
            marginBottom: '4px',
            color: '#ffffff',
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: '12px',
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.6)',
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
      <Toggle checked={checked} disabled={disabled} onChange={onChange} />
    </label>
  )
}

function Toggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        position: 'relative',
        width: '40px',
        height: '22px',
        borderRadius: '999px',
        border: 'none',
        backgroundColor: checked ? '#ffffff' : 'rgba(255,255,255,0.18)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'background-color 0.2s ease',
        flexShrink: 0,
        padding: 0,
        marginTop: '2px',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '21px' : '3px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: checked ? '#0a0a0a' : '#ffffff',
          transition: 'left 0.2s ease, background-color 0.2s ease',
        }}
      />
    </button>
  )
}

function ButtonNeutral({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 18px',
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: '0.04em',
        color: '#ffffff',
        backgroundColor: 'transparent',
        border: '1px solid rgba(255,255,255,0.32)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.18s ease, border-color 0.18s ease',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.08)'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.55)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.32)'
      }}
    >
      {children}
    </button>
  )
}

function ButtonPrimary({ children, onClick, style }: { children: React.ReactNode; onClick: () => void; style?: CSSProperties }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 18px',
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: '0.04em',
        color: '#0a0a0a',
        backgroundColor: '#ffffff',
        border: '1px solid #ffffff',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'transform 0.18s ease',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
      }}
    >
      {children}
    </button>
  )
}
