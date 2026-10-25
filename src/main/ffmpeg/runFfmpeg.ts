import { spawn } from 'child_process'
import { buildFfmpegArgs } from './buildFfmpegArgs'
import { FfmpegProgressParser } from './parseFfmpegProgress'
import type { RunFfmpegOptions } from './types'

const MAX_STDERR_CHARS = 64 * 1024

export class FfmpegCancelledError extends Error {
  constructor() {
    super('Encoding was stopped. Any partially encoded output file has been retained.')
    this.name = 'FfmpegCancelledError'
  }
}

export const runFfmpeg = ({
  ffmpegPath,
  inputFilePath,
  outputFilePath,
  videoCodec,
  codecOptions,
  containerFormat,
  onLog,
  onProgress,
  signal
}: RunFfmpegOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new FfmpegCancelledError())
      return
    }

    const args = buildFfmpegArgs({
      inputFilePath,
      outputFilePath,
      videoCodec,
      codecOptions,
      containerFormat
    })
    const progressParser = new FfmpegProgressParser()
    let lastProgress = -1
    let stderr = ''

    const ffmpegProcess = spawn(ffmpegPath, args, { shell: false })
    let stopTimer: ReturnType<typeof setTimeout> | undefined
    let processError: Error | undefined

    const stop = (): void => {
      if (stopTimer || ffmpegProcess.exitCode !== null || ffmpegProcess.signalCode !== null) return

      // Request a clean exit so FFmpeg can finalize the container on every platform.
      ffmpegProcess.stdin.end('q\n')
      stopTimer = setTimeout(() => ffmpegProcess.kill('SIGKILL'), 3000)
    }

    // A process can exit between a stop request and the stdin write.
    ffmpegProcess.stdin.on('error', () => undefined)
    signal?.addEventListener('abort', stop, { once: true })
    if (signal?.aborted) stop()

    ffmpegProcess.stderr.setEncoding('utf8')
    ffmpegProcess.stderr.on('data', (chunk: string) => {
      // Only the recent diagnostics are needed if encoding fails.
      stderr = (stderr + chunk.slice(-MAX_STDERR_CHARS)).slice(-MAX_STDERR_CHARS)
      if (signal?.aborted) return
      const progress = progressParser.parse(chunk)

      if (progress && progress.percent !== lastProgress) {
        lastProgress = progress.percent
        onLog(`Processing: ${progress.percent}% done`)
        onProgress?.({
          inputFilePath,
          outputFilePath,
          ...progress
        })
      }
    })

    ffmpegProcess.on('error', (error) => {
      processError = error
    })

    ffmpegProcess.on('close', (code) => {
      if (stopTimer) clearTimeout(stopTimer)
      signal?.removeEventListener('abort', stop)

      if (signal?.aborted) {
        reject(new FfmpegCancelledError())
        return
      }
      if (processError) {
        reject(processError)
        return
      }
      if (code === 0) {
        onLog('Processing finished !')
        resolve()
        return
      }

      const message = stderr.trim().split(/\r?\n/).at(-1) || `ffmpeg exited with code ${code}`
      reject(new Error(message))
    })
  })
}
