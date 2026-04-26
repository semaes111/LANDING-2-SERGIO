export interface Room {
  id: string
  title: string
  client: string
  img: string
  tagline: string
  description: string[]
  features: string[]
  price: string
  priceNote: string
  sqm: string
  occupancy: string
  bed: string
}

export const rooms: Room[] = [
  {
    id: '01',
    title: 'Reset Metabólico 90 días',
    client: 'Pacientes',
    img: '/images/program-reset.jpg',
    tagline: 'Programa integral de transformación metabólica con seguimiento médico continuo.',
    description: [
      'El programa Reset Metabólico 90 días es el protocolo principal de Centro NextHorizont Health. Diseñado en torno a una evaluación metabólica completa, combina tratamiento farmacológico individualizado (GLP-1), educación nutricional personalizada y seguimiento asistido por IA.',
      'Cada paciente recibe un plan de dosis escalonado, recordatorios de adherencia, revisiones médicas programadas y acceso a la comunidad privada. La medicina del siglo XXI combina rigor clínico, tecnología responsable y trato humano.',
    ],
    features: [
      'Evaluación completa y plan individualizado',
      'Seguimiento médico continuo durante 90 días',
      'Acceso a app con recordatorios y adherencia',
      'Comunidad privada de pacientes',
      'Garantía de satisfacción 30 días',
      'Telemedicina incluida',
    ],
    price: '499€',
    priceNote: 'pago único, incluye 90 días',
    sqm: '90 días',
    occupancy: '1 paciente',
    bed: 'Online + Presencial',
  },
  {
    id: '02',
    title: 'Consulta Médica GLP-1',
    client: 'Pacientes',
    img: '/images/program-glp1.jpg',
    tagline: 'Primera consulta especializada en tratamiento con análogos de GLP-1.',
    description: [
      'La consulta médica inicial con el Dr. Sergio Martínez Escobar incluye anamnesis completa, evaluación de candidatura a tratamiento con Semaglutida (Wegovy) o Tirzepatida (Mounjaro), y prescripción individualizada si procede.',
      'Se realiza pre-evaluación asistida por IA que ahorra tiempo en la consulta y se entrega un plan nutricional inicial. El medicamento se prescribe y se adquiere en farmacia con receta privada.',
    ],
    features: [
      'Consulta médica con Dr. Martínez Escobar',
      'Pre-evaluación IA gratuita',
      'Prescripción Wegovy / Mounjaro si procede',
      'Plan nutricional inicial personalizado',
      'Receta privada para farmacia',
      'WhatsApp directo para preguntas',
      'Seguimiento telefónico a 7 días',
    ],
    price: '99€',
    priceNote: 'primera visita',
    sqm: 'Consulta',
    occupancy: '1 paciente',
    bed: 'Presencial / Online',
  },
  {
    id: '03',
    title: 'Curso de Nutrición Clínica',
    client: 'Pacientes',
    img: '/images/program-nutricion.jpg',
    tagline: 'Aprende a comer desde la evidencia científica, no desde la moda.',
    description: [
      'Curso digital de nutrición clínica basado en evidencia científica. Pensado para pacientes que quieren entender qué comer, cuándo y por qué, sin dogmas ni dietas milagro. Contenido actualizado con las últimas guías SEEDO y AEMPS.',
      'Incluye módulos interactivos sobre metabolismo, macronutrientes, ayuno intermitente, lectura de etiquetas, planificación de menús y estrategias para comer fuera de casa. Acceso de por vida con actualizaciones.',
    ],
    features: [
      '12 módulos en video con el equipo médico',
      'Guías descargables y planificador de menús',
      'Foro privado para resolver dudas',
      'Certificado de finalización',
      'Actualizaciones de contenido gratuitas',
      'Acceso desde app y web',
    ],
    price: '149€',
    priceNote: 'pago único, acceso de por vida',
    sqm: '12 módulos',
    occupancy: '1 estudiante',
    bed: '100% online',
  },
  {
    id: '04',
    title: 'Guía para Aprender a Comer',
    client: 'Pacientes',
    img: '/images/program-guias.jpg',
    tagline: 'Una guía práctica para reconstruir tu relación con la comida.',
    description: [
      'Guía digital práctica enfocada en la reeducación alimentaria: comer con atención plena, identificar hambre emocional, gestionar antojos y construir hábitos sostenibles. Basada en terapia cognitivo-conductual y nutrición conductual.',
      'Diseñada para pacientes que han terminado el programa Reset o que buscan un recurso autónomo para mantener resultados. Incluye ejercicios diarios, diario de alimentación estructurado y checklists de progreso.',
    ],
    features: [
      'Guía PDF interactiva + ejercicios',
      'Diario de alimentación estructurado',
      'Estrategias para antojos y hambre emocional',
      'Plan de 21 días de hábitos',
      'Compatible con programa Reset',
      'Acceso inmediato tras compra',
    ],
    price: '49€',
    priceNote: 'guía digital descargable',
    sqm: '1 guía',
    occupancy: '1 usuario',
    bed: '100% digital',
  },
  {
    id: '05',
    title: 'Control del Peso Premium',
    client: 'Pacientes',
    img: '/images/program-peso.jpg',
    tagline: 'Seguimiento mensual médico para mantener resultados a largo plazo.',
    description: [
      'Membership de control del peso con seguimiento mensual por el Dr. Martínez Escobar. Incluye revisión de biomarcadores, ajuste de dosis, análisis de composición corporal y acceso completo a la app de seguimiento.',
      'Ideal para pacientes que han completado el Reset Metabólico o que requieren supervisión continua. El objetivo es prevenir el rebote y consolidar hábitos metabólicos saludables con apoyo médico real.',
    ],
    features: [
      'Revisión médica mensual',
      'Ajuste continuo de dosis y plan',
      'Análisis de composición corporal',
      'App de seguimiento con dashboards',
      'WhatsApp directo para preguntas',
      'Acceso a sesiones live grupales',
      'Cancelable en cualquier momento',
    ],
    price: '79€',
    priceNote: '/ mes, sin permanencia',
    sqm: 'Mensual',
    occupancy: '1 paciente',
    bed: 'Online + Presencial',
  },
  {
    id: '06',
    title: 'Programa para Profesionales',
    client: 'Profesionales',
    img: '/images/dr-receta-biomarcadores.png',
    tagline: 'Formación avanzada en medicina metabólica y manejo de GLP-1.',
    description: [
      'Programa de formación continua para médicos, endocrinos, nutricionistas y farmacéuticos que desean incorporar el manejo clínico de análogos de GLP-1 a su práctica. Incluye casos clínicos reales, protocolos de dosis y manejo de efectos adversos.',
      'Dictado por el Dr. Sergio Martínez Escobar con ponentes invitados de SEEDO y SEMICYUC. Incluye acceso a bibliografía indexada, foro privado de profesionales y certificado con créditos de formación.',
    ],
    features: [
      '20 horas de contenido en video',
      'Casos clínicos reales anonimizados',
      'Protocolos de dosis y escalado',
      'Bibliografía indexada actualizada',
      'Foro privado de profesionales',
      'Certificado con créditos de formación',
    ],
    price: '299€',
    priceNote: 'pago único, acceso 1 año',
    sqm: '20 h',
    occupancy: '1 profesional',
    bed: '100% online',
  },
]
