// ─────────────────────────────────────────────────────────────────────────────
// Fuente de verdad ÚNICA de los artículos del blog.
//
// Para publicar un blog nuevo:
//   1. Crea app/blog/<slug>/page.tsx (la prosa + sus schemas BlogPosting/FAQ).
//   2. Crea app/en/blog/<slug>/page.tsx (espejo noindex que re-exporta el ES).
//   3. Agrega UN objeto al inicio de BLOG_POSTS (el más nuevo va primero).
//
// Con eso, el sitemap, el índice /blog, la home, "Sigue leyendo", los schemas
// ItemList y los hreflang se actualizan SOLOS. (public/llms.txt y llms-full.txt
// siguen siendo curados a mano: son documentos editoriales.)
// ─────────────────────────────────────────────────────────────────────────────

export type BlogPost = {
  slug: string
  categoryEs: string
  categoryEn: string
  /** Título completo (hero, índice, schema ItemList, OpenGraph). */
  titleEs: string
  titleEn: string
  /** Título corto para listas compactas ("Sigue leyendo"). */
  shortTitleEs: string
  shortTitleEn: string
  excerptEs: string
  excerptEn: string
  readTime: string
  dateEs: string
  dateEn: string
  image: string
  /** Color de acento (chip de categoría, enlaces). */
  color: string
  /** Fecha ISO de última modificación — alimenta <lastmod> del sitemap. */
  lastModified: string
  /** Prioridad en el sitemap (0–1). Por defecto 0.8. */
  priority?: number
  /**
   * `true` si existe una traducción inglesa REAL en /en/blog/<slug> (prosa
   * traducida, página indexable). El sitemap emite entonces el espejo /en con
   * hreflang. Por defecto false → la /en va con robots noindex.
   */
  translated?: boolean
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "el-gol-en-pausa",
    categoryEs: "UX y Comportamiento Humano",
    categoryEn: "UX & Human Behavior",
    titleEs: "El Gol en Pausa: Cómo el VAR Está Cambiando la Emoción y el Comportamiento del Hincha",
    titleEn: "The Goal on Pause: How VAR Is Changing Fan Emotion and Behavior",
    shortTitleEs: "El Gol en Pausa: el VAR y la Emoción del Hincha",
    shortTitleEn: "The Goal on Pause: VAR and Fan Emotion",
    excerptEs:
      "Una solución puede ser técnicamente correcta y emocionalmente dañina. El VAR es la metáfora perfecta del diseño tecnológico que se obsesiona con tener razón y olvida cómo se siente usarlo.",
    excerptEn:
      "A solution can be technically correct and emotionally damaging. VAR is the perfect metaphor for technology that obsesses over being right and forgets how it feels to use it.",
    readTime: "12 min",
    dateEs: "Junio 2026",
    dateEn: "June 2026",
    image: "/images/blog-gol-en-pausa.png",
    color: "#2AABB3",
    lastModified: "2026-06-30",
    priority: 0.85,
  },
  {
    slug: "dirigir-inteligencias",
    categoryEs: "IA y Futuro del Trabajo",
    categoryEn: "AI & Future of Work",
    titleEs: "Ya No Estamos Aprendiendo a Trabajar. Estamos Aprendiendo a Dirigir Inteligencias",
    titleEn: "We're No Longer Learning to Work. We're Learning to Direct Intelligences",
    shortTitleEs: "Ya No Aprendemos a Trabajar, Aprendemos a Dirigir Inteligencias",
    shortTitleEn: "We're Learning to Direct Intelligences, Not to Work",
    excerptEs:
      "El fin de los prompts. La próxima ventaja competitiva no será preguntar mejor, sino construir sistemas que piensen, aprendan y actúen contigo.",
    excerptEn:
      "The end of prompts. The next competitive edge won't be asking better — it will be building systems that think, learn, and act with you.",
    readTime: "9 min",
    dateEs: "Junio 2026",
    dateEn: "June 2026",
    image: "/images/blog-dirigir-inteligencias-v2.png",
    color: "#2AABB3",
    lastModified: "2026-06-18",
    priority: 0.85,
    translated: true,
  },
  {
    slug: "arquitectura-percepcion",
    categoryEs: "Diseño UX",
    categoryEn: "UX Design",
    titleEs: "La Arquitectura de la Percepción: Tus Usuarios No Navegan Flujos, Sino Estados Emocionales",
    titleEn: "The Architecture of Perception: Your Users Don't Navigate Flows, They Navigate Emotional States",
    shortTitleEs: "La Arquitectura de la Percepción",
    shortTitleEn: "The Architecture of Perception",
    excerptEs:
      "El error más costoso del UX moderno es diseñar para un usuario ideal en lugar del usuario real. Descubre los 4 estados críticos de la percepción consciente.",
    excerptEn:
      "Modern UX's costliest mistake is designing for an ideal user instead of the real one. Discover the 4 critical states of conscious perception.",
    readTime: "8 min",
    dateEs: "Mayo 2026",
    dateEn: "May 2026",
    image: "/images/blog-arquitectura-percepcion.jpg",
    color: "#E8751A",
    lastModified: "2026-05-14",
  },
  {
    slug: "adn-del-significado",
    categoryEs: "Producto",
    categoryEn: "Product",
    titleEs: "El ADN del Significado: Por Qué la Motivación No Basta para Retener Usuarios",
    titleEn: "The DNA of Meaning: Why Motivation Isn't Enough to Retain Users",
    shortTitleEs: "El ADN del Significado",
    shortTitleEn: "The DNA of Meaning",
    excerptEs:
      "La motivación inicia la acción, pero el significado sostiene el hábito. 4 patrones de diseño noético para crear productos que trascienden.",
    excerptEn:
      "Motivation starts the action, but meaning sustains the habit. 4 noetic design patterns to create products that transcend.",
    readTime: "7 min",
    dateEs: "Mayo 2026",
    dateEn: "May 2026",
    image: "/images/blog-adn-del-significado.jpg",
    color: "#2AABB3",
    lastModified: "2026-05-14",
  },
  {
    slug: "trono-de-la-decision",
    categoryEs: "IA y Ética",
    categoryEn: "AI & Ethics",
    titleEs: "El Trono de la Decisión: IA, Autonomía Humana y Diseño Ético",
    titleEn: "The Throne of Decision: AI, Human Autonomy, and Ethical Design",
    shortTitleEs: "El Trono de la Decisión: IA y Diseño Ético",
    shortTitleEn: "The Throne of Decision: AI & Ethical Design",
    excerptEs:
      "En la era de los agentes de IA, el mayor riesgo no es la privacidad — es la infantilización del usuario.",
    excerptEn:
      "In the age of AI agents, the greatest risk isn't privacy — it's the infantilization of the user.",
    readTime: "9 min",
    dateEs: "Mayo 2026",
    dateEn: "May 2026",
    image: "/images/blog-zero-ui-decision.png",
    color: "#E8751A",
    lastModified: "2026-05-14",
  },
  {
    slug: "influencia-sin-erosion",
    categoryEs: "Diseño Conductual",
    categoryEn: "Behavioral Design",
    titleEs: "Influencia sin Erosión: Diseño de Comportamiento Sostenible sin Manipular",
    titleEn: "Influence Without Erosion: Sustainable Behavioral Design Without Manipulation",
    shortTitleEs: "Influencia sin Erosión: Diseño Conductual Sostenible",
    shortTitleEn: "Influence Without Erosion",
    excerptEs:
      "El comportamiento sostenido no nace de la presión. Nace de una conciencia respetada.",
    excerptEn:
      "Sustained behavior doesn't come from pressure. It comes from a respected consciousness.",
    readTime: "10 min",
    dateEs: "Mayo 2026",
    dateEn: "May 2026",
    image: "/images/blog-influencia-sin-erosion.jpg",
    color: "#2AABB3",
    lastModified: "2026-05-14",
  },
  {
    slug: "psicologia-adopcion",
    categoryEs: "UX",
    categoryEn: "UX",
    titleEs: "Psicología de la Adopción Digital",
    titleEn: "The Psychology of Digital Adoption",
    shortTitleEs: "Psicología de la Adopción Digital",
    shortTitleEn: "Psychology of Digital Adoption",
    excerptEs:
      "Cómo aplicar principios de psicología del consumidor para acelerar la adopción de productos digitales B2B y B2C.",
    excerptEn:
      "How to apply consumer psychology principles to accelerate adoption of B2B and B2C digital products.",
    readTime: "6 min",
    dateEs: "Abril 2026",
    dateEn: "April 2026",
    image: "/images/blog-behavioral.jpg",
    color: "#E8751A",
    lastModified: "2026-05-14",
  },
  {
    slug: "discovery-ia",
    categoryEs: "IA",
    categoryEn: "AI",
    titleEs: "Discovery de Producto con IA",
    titleEn: "Product Discovery with AI",
    shortTitleEs: "Discovery de Producto con IA",
    shortTitleEn: "Product Discovery with AI",
    excerptEs:
      "Cómo la inteligencia artificial está transformando el proceso de discovery de producto y reduciendo tiempos de definición.",
    excerptEn:
      "How artificial intelligence is transforming product discovery and reducing definition time.",
    readTime: "7 min",
    dateEs: "Abril 2026",
    dateEn: "April 2026",
    image: "/images/blog-ai.jpg",
    color: "#2AABB3",
    lastModified: "2026-05-14",
  },
  {
    slug: "ux-fintech",
    categoryEs: "Fintech",
    categoryEn: "Fintech",
    titleEs: "UX en Fintech: Diseñar para la Confianza",
    titleEn: "UX in Fintech: Designing for Trust",
    shortTitleEs: "UX en Fintech: Diseñar para la Confianza",
    shortTitleEn: "UX in Fintech: Designing for Trust",
    excerptEs:
      "Estrategias de diseño UX específicas para productos fintech que necesitan construir confianza desde el primer contacto.",
    excerptEn:
      "UX design strategies specific to fintech products that need to build trust from the first touch.",
    readTime: "8 min",
    dateEs: "Marzo 2026",
    dateEn: "March 2026",
    image: "/images/blog-fintech.jpg",
    color: "#E8751A",
    lastModified: "2026-05-14",
  },
  {
    slug: "mvp-escala",
    categoryEs: "Startups",
    categoryEn: "Startups",
    titleEs: "Del MVP a la Escala",
    titleEn: "From MVP to Scale",
    shortTitleEs: "Del MVP a la Escala",
    shortTitleEn: "From MVP to Scale",
    excerptEs:
      "Cómo diseñar un MVP que no solo valide tu idea, sino que esté preparado para escalar sin deuda técnica.",
    excerptEn:
      "How to design an MVP that not only validates your idea but is also ready to scale without technical debt.",
    readTime: "6 min",
    dateEs: "Marzo 2026",
    dateEn: "March 2026",
    image: "/images/blog-mvp.jpg",
    color: "#2AABB3",
    lastModified: "2026-05-14",
  },
]

/** Mapa slug → post, para lookups puntuales. */
export const BLOG_POSTS_BY_SLUG: Record<string, BlogPost> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, p]),
)
