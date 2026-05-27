"use client"

import { useEffect } from "react"

export function HomeScrollRestorer() {
  useEffect(() => {
    const behavior = sessionStorage.getItem("homeNavBehavior")
    const savedY = sessionStorage.getItem("homeScrollY")
    sessionStorage.removeItem("homeNavBehavior")

    if (behavior === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (savedY) {
      sessionStorage.removeItem("homeScrollY")
      window.scrollTo({ top: parseInt(savedY, 10), behavior: "smooth" })
    }
  }, [])

  return null
}
