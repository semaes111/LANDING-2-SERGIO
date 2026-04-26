import Lenis from 'lenis'
import { useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Smooth Scroll provider — wraps the entire app with Lenis-driven smooth scrolling.
 *
 * Design choices for medical/sober brand:
 * - duration: 1.2s (enough to feel premium, not slow enough to feel laggy)
 * - easing: cubic-bezier ease-out (gentle deceleration)
 * - Lenis ↔ GSAP ScrollTrigger sync: every frame Lenis pumps a tick into
 *   ScrollTrigger.update() so all existing GSAP scroll-triggered animations
 *   keep working in lockstep with the smoothed scroll position.
 * - Disabled on touch devices (iOS/Android) — native scroll already feels smooth
 *   and Lenis on mobile causes momentum-scroll conflicts and breaks pull-to-refresh.
 * - Respects prefers-reduced-motion: users who disabled animations get native scroll.
 *
 * Usage:
 *   <SmoothScroll>
 *     <App />
 *   </SmoothScroll>
 *
 * Note: this component MUST live above react-router's <Routes> so that scroll
 * smoothing persists across route changes.
 */

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Skip Lenis on touch devices and reduced-motion preference
    const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isTouch || reducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    // Sync Lenis with GSAP ScrollTrigger so existing animations stay aligned
    lenis.on('scroll', ScrollTrigger.update)

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Tell GSAP to use Lenis' scroll position instead of window's
    gsap.ticker.lagSmoothing(0)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
