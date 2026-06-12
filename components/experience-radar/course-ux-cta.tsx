import Link from "next/link"

export function CourseUxCta({
  title,
  body,
  discount,
  code,
  buttonLabel,
  href,
}: {
  title: string
  body: string
  discount: string
  code: string
  buttonLabel: string
  href: string
}) {
  return (
    <aside className="mt-10 rounded-lg border border-[var(--cyan)]/30 bg-[var(--cyan)]/10 p-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{body}</p>
      <p className="mt-3 text-sm font-semibold">{discount}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="rounded-md border border-border bg-background px-3 py-2 text-sm font-bold tracking-wide">
          {code}
        </span>
        <Link
          href={href}
          className="inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-[var(--magenta)] hover:text-white"
        >
          {buttonLabel}
        </Link>
      </div>
    </aside>
  )
}
