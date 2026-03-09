"use client"

import { useState } from "react"
import { Calendar, Clock, ArrowRight, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Helper to disable weekends and mondays, and limit to 10 days
const getNextDays = (count: number) => {
  const days = []
  let current = new Date()
  current.setDate(current.getDate() + 1) // start from tomorrow

  while (days.length < count) {
    const dayOfWeek = current.getDay()
    // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
    if (dayOfWeek >= 2 && dayOfWeek <= 5) {
      days.push(new Date(current))
    }
    current.setDate(current.getDate() + 1)
  }
  return days
}

const formatShortDate = (d: Date) => {
  return d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" })
}

export function BookingModal({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [callBooked, setCallBooked] = useState(false)

  const availableDays = getNextDays(10)
  const accent = "#E8751A"
  const btnStyle = { background: "linear-gradient(90deg, #E8751A, #c65a10)" }

  const handleBookCall = () => {
    if (!selectedDay || !selectedSlot) return
    setCallBooked(true)
  }

  // To allow restarting the modal
  const handleOpenChange = (open: boolean) => {
    if (!open && callBooked) {
      setTimeout(() => {
        setCallBooked(false)
        setSelectedDay(null)
        setSelectedSlot(null)
      }, 500)
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card border-border sm:rounded-2xl shadow-2xl p-0 overflow-hidden" showCloseButton={true}>
        {callBooked ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-[500px]">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: "rgba(232,117,26,0.1)", color: accent }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-display font-bold text-3xl mb-3 text-foreground">
              {t("¡Llamada Agendada!", "Call Booked!")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t("Te hemos enviado las instrucciones para la videollamada a tu correo.", "We've sent the video call instructions to your email.")}
            </p>
            <div className="bg-secondary/50 rounded-xl p-4 w-full flex flex-col items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {selectedDay ? formatShortDate(selectedDay) : ""}
              </span>
              <span className="text-lg font-bold" style={{ color: accent }}>
                {selectedSlot} (COT)
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[600px] sm:h-auto overflow-y-auto">
            <DialogHeader className="p-6 md:p-8 pb-0 shrink-0 text-left">
              <DialogTitle className="font-display font-bold text-2xl mb-1 text-foreground">
                {t("Agendar llamada de Discovery", "Book a Discovery Call")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {t("Selecciona un día y hora para hablar con nuestro equipo.", "Select a day and time to talk with our team.")}
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 md:p-8 flex-1 flex flex-col gap-8">
              {/* Day selection */}
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Calendar size={16} /> {t("1. Selecciona el día (Mar - Vie)", "1. Select day (Tue - Fri)")}
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {availableDays.map((d, i) => {
                    const isSelected = selectedDay?.getDate() === d.getDate()
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setSelectedDay(d); setSelectedSlot(null) }}
                        className={`py-3 px-3 text-sm font-medium rounded-xl border transition-all text-left ${
                          isSelected
                            ? "bg-stone-100 dark:bg-stone-800 text-foreground"
                            : "bg-background border-border text-muted-foreground hover:bg-secondary/50"
                        }`}
                        style={{ borderColor: isSelected ? accent : "var(--border)" }}
                      >
                        {formatShortDate(d)}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time selection */}
              <div className={`flex flex-col gap-3 transition-opacity duration-300 ${!selectedDay ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
                <span className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Clock size={16} /> {t("2. Selecciona la hora (Hora Colombia)", "2. Select time (Colombia Time)")}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => {
                    const isSelected = selectedSlot === time
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedSlot(time)}
                        className={`py-2 text-sm font-medium rounded-xl border transition-all text-center ${
                          isSelected
                            ? "bg-stone-100 dark:bg-stone-800 text-foreground"
                            : "bg-background border-border text-muted-foreground hover:bg-secondary/50"
                        }`}
                        style={{ borderColor: isSelected ? accent : "var(--border)" }}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="p-6 md:p-8 pt-0 mt-auto shrink-0 border-t border-border/50">
              <button
                type="button"
                onClick={handleBookCall}
                disabled={!selectedDay || !selectedSlot}
                className="w-full flex mt-6 items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
                style={btnStyle}
              >
                {t("Confirmar cita", "Confirm appointment")} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
