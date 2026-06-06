import { spawn } from 'child_process'
import { buildFfmpegArgs } from './buildFfmpegArgs'
import { FfmpegProgressParser } from './parseFfmpegProgress'
import type { RunFfmpegOptions } from './types'

export const runFfmpeg = ({
  ffmpegPath,
  inputFilePath,
  outputFilePath,
  videoCodec,
  codecOptions,
  containerFormat,
  onLog,
  onProgress
}: RunFfmpegOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
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

    ffmpegProcess.stderr.setEncoding('utf8')
    ffmpegProcess.stderr.on('data', (chunk: string) => {
      stderr += chunk
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
      reject(error)
    })

    ffmpegProcess.on('close', (code) => {
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
