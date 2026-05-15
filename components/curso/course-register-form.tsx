"use client"

import { useState } from "react"
import { Send, Loader2, CheckCircle, User, Mail, Briefcase, Sparkles, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/lib/language-context"

const roles = [
  "Diseñador/a UX/UI",
  "Product Designer",
  "Developer / Ingeniero",
  "Product Manager",
  "Founder / CEO",
  "Estudiante",
  "Otro",
]

const experienceLevels = [
  "Nunca he usado IA profesionalmente",
  "He experimentado con ChatGPT / Claude",
  "Uso IA regularmente en mi trabajo",
  "Integro IA en flujos de producto",
]

export function CourseRegisterForm() {
  const { localized } = useLanguage()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [experience, setExperience] = useState("")
  const [motivation, setMotivation] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim() || !email.trim()) {
      setError("Nombre y email son obligatorios.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un email válido.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/course-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, experience, motivation }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSubmitted(true)
      } else {
        setError(data.error || "Error al enviar. Intenta de nuevo.")
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="p-8 rounded-2xl border border-[var(--cyan)]/20 bg-foreground/[0.03] text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center" style={{ background: 'var(--cyan)' }}>
          <CheckCircle size={28} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3 font-display">
          ¡Registro recibido!
        </h3>
        <p className="text-foreground/50 text-sm leading-relaxed mb-3">
          Gracias, <span className="text-foreground font-medium">{name}</span>. Te contactaremos en las próximas 48 horas con los detalles de inscripción.
        </p>
        <p className="text-xs text-foreground/30">
          Revisa tu bandeja de entrada y spam por el email de confirmación.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="p-6 md:p-8 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.03] backdrop-blur-sm">
      <h3 className="text-lg font-bold text-foreground mb-1 font-display">Reserva tu lugar</h3>
      <p className="text-xs text-foreground/40 mb-6">Completa el formulario y te contactaremos con los detalles.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="course-name" className="flex items-center gap-1.5 text-xs font-medium text-foreground/60">
            <User size={12} style={{ color: 'var(--magenta)' }} />
            Nombre completo <span className="text-[var(--magenta)]">*</span>
          </label>
          <input
            id="course-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
            required
            className="w-full px-3.5 py-3 rounded-xl bg-foreground/[0.05] border border-foreground/[0.08] text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-[var(--magenta)]/40 focus:bg-foreground/[0.07] transition-all duration-200 text-sm"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="course-email" className="flex items-center gap-1.5 text-xs font-medium text-foreground/60">
            <Mail size={12} style={{ color: 'var(--magenta)' }} />
            Email <span className="text-[var(--magenta)]">*</span>
          </label>
          <input
            id="course-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="w-full px-3.5 py-3 rounded-xl bg-foreground/[0.05] border border-foreground/[0.08] text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-[var(--magenta)]/40 focus:bg-foreground/[0.07] transition-all duration-200 text-sm"
          />
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <label htmlFor="course-role" className="flex items-center gap-1.5 text-xs font-medium text-foreground/60">
            <Briefcase size={12} style={{ color: 'var(--cyan)' }} />
            Rol profesional
          </label>
          <select
            id="course-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3.5 py-3 rounded-xl bg-foreground/[0.05] border border-foreground/[0.08] text-foreground focus:outline-none focus:border-[var(--cyan)]/40 focus:bg-foreground/[0.07] transition-all duration-200 text-sm appearance-none cursor-pointer"
          >
            <option value="" className="bg-background">Selecciona tu rol</option>
            {roles.map((r) => (
              <option key={r} value={r} className="bg-background">{r}</option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div className="space-y-1.5">
          <label htmlFor="course-experience" className="flex items-center gap-1.5 text-xs font-medium text-foreground/60">
            <Sparkles size={12} style={{ color: 'var(--cyan)' }} />
            Experiencia con IA
          </label>
          <select
            id="course-experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full px-3.5 py-3 rounded-xl bg-foreground/[0.05] border border-foreground/[0.08] text-foreground focus:outline-none focus:border-[var(--cyan)]/40 focus:bg-foreground/[0.07] transition-all duration-200 text-sm appearance-none cursor-pointer"
          >
            <option value="" className="bg-background">Selecciona tu nivel</option>
            {experienceLevels.map((l) => (
              <option key={l} value={l} className="bg-background">{l}</option>
            ))}
          </select>
        </div>

        {/* Motivation */}
        <div className="space-y-1.5">
          <label htmlFor="course-motivation" className="flex items-center gap-1.5 text-xs font-medium text-foreground/60">
            <MessageSquare size={12} style={{ color: 'var(--magenta)' }} />
            ¿Qué te motiva? <span className="text-foreground/30 text-xs">(opcional)</span>
          </label>
          <textarea
            id="course-motivation"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            placeholder="Cuéntanos brevemente..."
            rows={2}
            className="w-full px-3.5 py-3 rounded-xl bg-foreground/[0.05] border border-foreground/[0.08] text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-[var(--magenta)]/40 focus:bg-foreground/[0.07] transition-all duration-200 text-sm resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ background: 'var(--magenta)' }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send size={16} />
              Registrarme al curso
            </>
          )}
        </button>

        <p className="text-[10px] text-foreground/20 text-center leading-relaxed">
          Al registrarte aceptas nuestra{" "}
          <a href={localized("/politica-de-privacidad")} className="underline hover:text-foreground/40 transition-colors">política de privacidad</a>.
        </p>
      </form>
    </div>
  )
}
