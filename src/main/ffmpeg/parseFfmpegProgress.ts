const timeToSeconds = (time: string): number => {
  const [hours = '0', minutes = '0', seconds = '0'] = time.split(':')

  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
}

export class FfmpegProgressParser {
  private durationSeconds = 0
  private pendingLine = ''

  parse(
    chunk: string
  ): { percent: number; elapsedSeconds: number; durationSeconds: number } | null {
    const buffered = this.pendingLine + chunk
    const lineEnd = Math.max(buffered.lastIndexOf('\r'), buffered.lastIndexOf('\n'))
    // FFmpeg uses both newlines and carriage returns. Never parse an unfinished
    // timestamp, and bound retained text even if a diagnostic line is very long.
    this.pendingLine = buffered.slice(lineEnd + 1).slice(-4096)
    if (lineEnd < 0) return null

    const completeLines = buffered.slice(0, lineEnd + 1)
    const durationMatch = completeLines.match(/Duration:\s*(\d{2}:\d{2}:\d{2}\.\d+)/)

    if (durationMatch) {
      this.durationSeconds = timeToSeconds(durationMatch[1])
    }

    const timeMatches = [...completeLines.matchAll(/time=(\d{2}:\d{2}:\d{2}\.\d+)/g)]
    const latestTime = timeMatches.at(-1)?.[1]

    if (!latestTime || this.durationSeconds <= 0) {
      return null
    }

    const elapsedSeconds = timeToSeconds(latestTime)
    const percent = Math.min(
      100,
      Math.max(0, Math.floor((elapsedSeconds / this.durationSeconds) * 100))
    )

    return {
      percent,
      elapsedSeconds,
      durationSeconds: this.durationSeconds
    }
  }
}
