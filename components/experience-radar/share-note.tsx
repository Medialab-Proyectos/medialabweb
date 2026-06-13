"use client"

import { useEffect, useState } from "react"
import { Share2, Mail, Link2, Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

/**
 * Botonera para compartir la nota: WhatsApp, X, Facebook, LinkedIn, correo y copiar
 * enlace. En móvil ofrece además el menú nativo (Web Share API) cuando existe.
 * Reutilizable en la nota ES y su espejo EN (textos vía useLanguage).
 */
export function ShareNote({ url, title }: { url: string; title: string }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState(url)
  const [canNativeShare, setCanNativeShare] = useState(false)

  // En el cliente, preferimos la URL real de la pestaña (respeta /en y el dominio).
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href)
      setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share)
    }
  }, [])

  const enc = encodeURIComponent
  const text = `${title} — Experience Radar`

  const links = {
    whatsapp: `https://wa.me/?text=${enc(`${text} ${shareUrl}`)}`,
    x: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}`,
    email: `mailto:?subject=${enc(text)}&body=${enc(`${title}\n\n${shareUrl}`)}`,
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Sin permiso de portapapeles: el usuario puede copiar manualmente desde la barra.
    }
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text, url: shareUrl })
    } catch {
      // El usuario canceló o el navegador no lo permitió.
    }
  }

  const btn =
    "inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground/80 transition-colors hover:border-[var(--cyan)] hover:text-[var(--cyan)]"

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Share2 size={14} /> {t("Compartir", "Share")}
      </span>

      {canNativeShare && (
        <button type="button" onClick={nativeShare} className={btn} aria-label={t("Compartir", "Share")}>
          <Share2 size={14} /> {t("Compartir", "Share")}
        </button>
      )}

      <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={btn} aria-label="WhatsApp">
        <BrandIcon name="whatsapp" /> WhatsApp
      </a>
      <a href={links.x} target="_blank" rel="noopener noreferrer" className={btn} aria-label="X">
        <BrandIcon name="x" /> X
      </a>
      <a href={links.facebook} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Facebook">
        <BrandIcon name="facebook" /> Facebook
      </a>
      <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className={btn} aria-label="LinkedIn">
        <BrandIcon name="linkedin" /> LinkedIn
      </a>
      <a href={links.email} className={btn} aria-label={t("Correo", "Email")}>
        <Mail size={14} /> {t("Correo", "Email")}
      </a>
      <button type="button" onClick={copy} className={btn} aria-label={t("Copiar enlace", "Copy link")}>
        {copied ? <Check size={14} className="text-[#16A34A]" /> : <Link2 size={14} />}
        {copied ? t("Copiado", "Copied") : t("Copiar", "Copy")}
      </button>
    </div>
  )
}

/** Íconos de marca (lucide retiró los brand icons): SVG mínimos inline. */
function BrandIcon({ name }: { name: "whatsapp" | "x" | "facebook" | "linkedin" }) {
  const common = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "currentColor" as const, "aria-hidden": true }
  switch (name) {
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M.06 24l1.69-6.16a11.87 11.87 0 01-1.6-5.96A11.9 11.9 0 0112.04 0a11.9 11.9 0 018.42 20.32 11.9 11.9 0 01-14.3 1.94L.06 24zM6.6 20.13l.36.21a9.86 9.86 0 005.07 1.39 9.9 9.9 0 100-19.8 9.9 9.9 0 00-9.9 9.9c0 1.9.54 3.74 1.56 5.32l.24.38-1 3.65 3.67-.96zM17.9 14.3c-.07-.12-.26-.2-.55-.34-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.14-.19.29-.74.94-.9 1.13-.17.19-.33.21-.62.07-.29-.14-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.6-2-.17-.29-.02-.44.12-.59.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.54-.88-2.11-.23-.55-.46-.48-.64-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38 0 1.4 1.02 2.76 1.17 2.95.14.19 2.01 3.07 4.87 4.31.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36z" />
        </svg>
      )
    case "x":
      return (
        <svg {...common}>
          <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.6l5.24 6.93zM17.61 20.64h2.04L6.49 3.24H4.3z" />
        </svg>
      )
    case "facebook":
      return (
        <svg {...common}>
          <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6 4.39 10.98 10.13 11.88v-8.4H7.08v-3.48h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.48h-2.8v8.4C19.61 23.05 24 18.07 24 12.07z" />
        </svg>
      )
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.07 2.07 0 110-4.13 2.07 2.07 0 010 4.13zM7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
        </svg>
      )
  }
}
