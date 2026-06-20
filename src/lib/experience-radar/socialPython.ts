import { execFile } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import { promisify } from "node:util"

import type { ExperienceSignal, SourceUsage } from "./types"

const execFileAsync = promisify(execFile)

type SocialPlatform = "instagram" | "facebook" | "youtube"

type SocialCollectorResult = {
  signals: ExperienceSignal[]
  source: SourceUsage
}

function getPythonCommand(): { command: string; argsPrefix: string[] } {
  const root = process.cwd()
  const venvPython = path.join(root, ".venv-radar-social", "Scripts", "python.exe")
  if (!existsSync(venvPython)) {
    return { command: "py", argsPrefix: [] }
  }
  return { command: venvPython, argsPrefix: [] }
}

export async function runSocialCollector(
  platform: SocialPlatform,
  terms: string[],
): Promise<SocialCollectorResult> {
  const root = process.cwd()
  const script = path.join(root, "scripts", "experience_radar_social.py")
  const { command, argsPrefix } = getPythonCommand()
  const args = [
    ...argsPrefix,
    script,
    "--platform",
    platform,
    "--terms",
    JSON.stringify(terms),
  ]

  try {
    const { stdout } = await execFileAsync(command, args, {
      cwd: root,
      timeout: 60_000,
      maxBuffer: 4 * 1024 * 1024,
      windowsHide: true,
    })
    const parsed = JSON.parse(stdout) as Partial<SocialCollectorResult>
    return {
      signals: Array.isArray(parsed.signals) ? parsed.signals : [],
      source: parsed.source as SourceUsage,
    }
  } catch (error) {
    return {
      signals: [],
      source: {
        id: `${platform}-collector-unavailable`,
        name: `${platform[0].toUpperCase()}${platform.slice(1)} collector`,
        type: platform,
        url: "local-python-helper",
        ok: false,
        checkedAt: new Date().toISOString(),
        itemCount: 0,
        note: `No se pudo ejecutar el colector local de ${platform}: ${String(error)}`,
      },
    }
  }
}
