/**
 * Bandera de una selección, compartida por la nota (marcador, tarjetas de hinchada) y
 * el filtro de banderas del radar. Usa flagcdn vía <img> (confiable en Vercel/móvil,
 * sin depender del CSS de flag-icons). Si no hay código, muestra las 2 primeras letras.
 */
export function TeamFlag({ team, small = false }: { team: string; small?: boolean }) {
  const code = teamFlagCode(team)
  const size = small ? "h-4 w-6" : "h-6 w-9"
  if (!code) {
    return (
      <span
        className={`${size} inline-flex shrink-0 items-center justify-center rounded-[3px] border border-border bg-muted text-[9px] font-bold uppercase text-muted-foreground`}
      >
        {team.slice(0, 2)}
      </span>
    )
  }
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={`Bandera de ${team}`}
      className={`${size} shrink-0 rounded-[3px] object-cover shadow-sm`}
      loading="lazy"
    />
  )
}

export function teamFlagCode(value: string): string | undefined {
  const key = value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase()
  return {
    // Anfitriones
    mexico: "mx", canada: "ca", estadosunidos: "us", usa: "us",
    // En el fixture / datos actuales
    sudafrica: "za", southafrica: "za",
    coreadelsur: "kr", corea: "kr", southkorea: "kr",
    chequia: "cz", republicacheca: "cz", czechia: "cz",
    catar: "qa", qatar: "qa",
    suiza: "ch", switzerland: "ch",
    brasil: "br", brazil: "br",
    marruecos: "ma", morocco: "ma",
    haiti: "ht",
    escocia: "gb-sct", scotland: "gb-sct",
    australia: "au",
    turquia: "tr", turkiye: "tr", turkey: "tr",
    bosnia: "ba", bosniayherzegovina: "ba",
    paraguay: "py",
    japon: "jp", japan: "jp",
    polonia: "pl", poland: "pl",
    argentina: "ar", colombia: "co",
    espana: "es", spain: "es",
    francia: "fr", france: "fr",
    // Otras selecciones comunes del Mundial
    alemania: "de", germany: "de",
    inglaterra: "gb-eng", england: "gb-eng",
    portugal: "pt",
    paisesbajos: "nl", holanda: "nl", netherlands: "nl",
    italia: "it", italy: "it",
    uruguay: "uy", ecuador: "ec",
    croacia: "hr", croatia: "hr",
    belgica: "be", belgium: "be",
    senegal: "sn", ghana: "gh", nigeria: "ng", egipto: "eg",
    iran: "ir", arabiasaudita: "sa", saudiarabia: "sa",
    costarica: "cr", panama: "pa", honduras: "hn",
    noruega: "no", dinamarca: "dk", serbia: "rs", austria: "at",
    curazao: "cw", curacao: "cw",
    costademarfil: "ci", cotedivoire: "ci",
  }[key]
}
