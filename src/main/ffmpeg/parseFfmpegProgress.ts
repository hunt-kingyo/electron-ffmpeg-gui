const timeToSeconds = (time: string): number => {
  const [hours = '0', minutes = '0', seconds = '0'] = time.split(':')

  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
}

export class FfmpegProgressParser {
  private durationSeconds = 0

  parse(chunk: string): { percent: number; elapsedSeconds: number; durationSeconds: number } | null {
    const durationMatch = chunk.match(/Duration:\s*(\d{2}:\d{2}:\d{2}\.\d+)/)

    if (durationMatch) {
      this.durationSeconds = timeToSeconds(durationMatch[1])
    }

    const timeMatches = [...chunk.matchAll(/time=(\d{2}:\d{2}:\d{2}\.\d+)/g)]
    const latestTime = timeMatches.at(-1)?.[1]

    if (!latestTime || this.durationSeconds <= 0) {
      return null
    }

    const elapsedSeconds = timeToSeconds(latestTime)
    const percent = Math.min(100, Math.max(0, Math.floor((elapsedSeconds / this.durationSeconds) * 100)))

    return {
      percent,
      elapsedSeconds,
      durationSeconds: this.durationSeconds
    }
  }
}
