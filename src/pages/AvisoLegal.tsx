import LegalLayout from './LegalLayout'

export default function AvisoLegal() {
  return (
    <LegalLayout title="Aviso Legal">
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>1. Información general</h2>
        <p style={{ marginBottom: '16px' }}>
          El presente sitio web <strong>nexthorizont.com</strong> es titularidad de <strong>NextHorizont AI SL</strong>,
          sociedad mercantil inscrita en el Registro Mercantil de Almería, con domicilio social en
          C/ Bulevar de El Ejido 231, Portal I, 3B, 04700 El Ejido (Almería), España.
        </p>
        <p>
          El sitio es operado por el <strong>Dr. Sergio Martínez Escobar</strong>, especialista en Medicina
          Intensiva, Nº Colegiado <strong>04/1809464</strong>, Colegio Oficial de Médicos de Almería.
          Centro autorizado por la Consejería de Salud de la Junta de Andalucía.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>2. Finalidad del sitio web</h2>
        <p style={{ marginBottom: '16px' }}>
          El contenido de este sitio web tiene únicamente <strong>finalidad informativa y educativa</strong>.
          No constituye, en ningún caso, servicio de asistencia sanitaria ni sustituye la consulta médica
          presencial con un profesional de la salud cualificado.
        </p>
        <p>
          La información relativa a tratamientos farmacológicos (incluidos análogos de GLP-1 como
          Semaglutida / Wegovy o Tirzepatida / Mounjaro) se ofrece en contexto educativo, siempre
          sujeta a <strong>evaluación médica individualizada y prescripción individual</strong>. No se debe
          iniciar ningún tratamiento sin la supervisión de un médico colegiado.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>3. Propiedad intelectual</h2>
        <p>
          Todos los contenidos textuales, gráficos, logotipos, iconos, imágenes y software son propiedad
          de NextHorizont AI SL o de sus licenciantes, y están protegidos por la legislación española
          e internacional de propiedad intelectual e industrial. Queda prohibida su reproducción,
          distribución, comunicación pública o transformación sin autorización expresa por escrito.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>4. Responsabilidad</h2>
        <p style={{ marginBottom: '16px' }}>
          NextHorizont AI SL realiza los máximos esfuerzos para garantizar la exactitud y actualización
          de la información publicada, pero no puede garantizar la inexistencia de errores técnicos
          o tipográficos.
        </p>
        <p>
          El usuario se compromete a hacer un uso diligente del sitio web y de los servicios accesibles
          desde el mismo, con total sujeción a la ley, a la moral, al orden público y a las presentes
          condiciones.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>5. Enlaces externos</h2>
        <p>
          Este sitio puede contener enlaces a páginas web de terceros. NextHorizont AI SL no ejerce
          control sobre dichos sitios ni asume responsabilidad alguna sobre sus contenidos o políticas.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>6. Legislación aplicable y jurisdicción</h2>
        <p>
          Las presentes condiciones se rigen por la legislación española. Para la resolución de
          cualquier controversia que pudiera derivarse del acceso o uso del sitio web, el usuario
          y NextHorizont AI SL se someten a los juzgados y tribunales de Almería, con renuncia
          expresa a cualquier otro fuero que pudiera corresponderles.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: '20px', fontWeight: 500, color: '#000000', marginBottom: '16px' }}>7. Contacto</h2>
        <p>
          Para cualquier consulta legal, puede dirigirse a:
          <br />
          <strong>Email:</strong> dpo@nexthorizont.com
          <br />
          <strong>Dirección:</strong> C/ Bulevar de El Ejido 231, Portal I, 3B, 04700 El Ejido (Almería), España
        </p>
      </section>
    </LegalLayout>
  )
}
