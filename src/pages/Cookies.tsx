import LegalLayout from './LegalLayout'

export default function Cookies() {
  return (
    <LegalLayout title="Política de Cookies">
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>1. ¿Qué son las cookies?</h2>
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas
          un sitio web. Se utilizan ampliamente para hacer que los sitios funcionen de manera más
          eficiente, así como para proporcionar información a los propietarios del sitio.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>2. Tipos de cookies que utilizamos</h2>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#000000', marginBottom: '8px' }}>2.1 Cookies técnicas y necesarias</h3>
          <p>
            Son imprescindibles para el funcionamiento básico del sitio web. Permiten la navegación
            por la página y el uso de sus servicios esenciales (como el acceso a áreas seguras).
            No pueden desactivarse. Se instalan por imperativo legal según art. 22.2 LSSI.
          </p>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#000000', marginBottom: '8px' }}>2.2 Cookies de preferencias o funcionales</h3>
          <p>
            Permiten recordar información para que el usuario acceda al servicio con determinadas
            características que pueden diferenciar su experiencia (idioma, número de resultados de
            búsqueda, aspecto del contenido). Requieren consentimiento.
          </p>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#000000', marginBottom: '8px' }}>2.3 Cookies analíticas</h3>
          <p>
            Nos permiten cuantificar el número de usuarios y realizar la medición y análisis estadístico
            de la utilización que hacen los usuarios del sitio. Utilizamos <strong>PostHog</strong> para
            análisis de comportamiento, siempre con anonimización de IP y solo tras obtener tu
            consentimiento explícito. Puedes gestionar tu consentimiento en cualquier momento.
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#000000', marginBottom: '8px' }}>2.4 Cookies de marketing</h3>
          <p>
            No utilizamos cookies de marketing ni de remarketing de terceros en este sitio web.
            No compartimos datos de navegación con redes publicitarias.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>3. Gestión del consentimiento</h2>
        <p style={{ marginBottom: '16px' }}>
          Al acceder a nuestro sitio por primera vez, se te mostrará un banner de cookies que te
          permitirá aceptar o rechazar las cookies no esenciales de forma granular:
        </p>
        <ul style={{ listStyle: 'disc', paddingLeft: '24px', marginBottom: '16px' }}>
          <li><strong>Aceptar todo:</strong> consientes todas las cookies analíticas y funcionales.</li>
          <li><strong>Rechazar todo:</strong> solo se instalan cookies técnicas necesarias.</li>
          <li><strong>Configurar:</strong> eliges categoría por categoría qué cookies aceptas.</li>
        </ul>
        <p>
          Puedes modificar tu consentimiento en cualquier momento haciendo clic en el enlace
          "Configurar cookies" que aparece en el pie de página.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>4. Cómo desactivar cookies desde el navegador</h2>
        <p style={{ marginBottom: '16px' }}>
          Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la
          configuración de las opciones de tu navegador:
        </p>
        <ul style={{ listStyle: 'disc', paddingLeft: '24px', marginBottom: '16px' }}>
          <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</li>
          <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio</li>
          <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar cookies y datos de sitios web</li>
          <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio → Cookies y datos del sitio</li>
        </ul>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>5. Cookies de terceros</h2>
        <p>
          Actualmente no utilizamos cookies de terceros para fines de publicidad comportamental.
          Las únicas cookies de terceros que pueden instalarse son las de <strong>PostHog</strong>
          (analíticas propias, auto-alojadas en la UE) y las de <strong>Stripe</strong> (procesamiento
          de pagos, solo en páginas de checkout). Ambas requieren consentimiento previo, salvo las
          de Stripe que se limitan a la sesión de pago.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>6. Cambios en la política de cookies</h2>
        <p>
          NextHorizont AI SL se reserva el derecho a modificar esta política de cookies en cualquier
          momento para adaptarla a novedades legislativas o cambios en nuestros servicios. Te
          recomendamos revisarla periódicamente. Cualquier cambio sustancial te será notificado
          mediante el banner de cookies en tu próxima visita.
        </p>
      </section>
    </LegalLayout>
  )
}
