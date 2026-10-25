import { basename, extname, join } from 'path'
import { existsSync } from 'fs'
import getExt from '../getExt'
import { resolveFfmpegPath } from './resolveFfmpegPath'
import { FfmpegCancelledError, runFfmpeg } from './runFfmpeg'
import type { AllOptions, FfmpegProgress, FfmpegStatus, RunFfmpegResult } from './types'

interface RunFfmpegBatchOptions {
  signal: AbortSignal
  onLog: (message: string) => void
  onProgress: (progress: FfmpegProgress) => void
  onStatus: (status: FfmpegStatus) => void
}

export const runFfmpegBatch = async (
  allOptions: AllOptions,
  { signal, onLog, onProgress, onStatus }: RunFfmpegBatchOptions
): Promise<RunFfmpegResult[]> => {
  const { inputFileList, videoCodec, codecOption, containerFormat, suffix, outputFolder } =
    allOptions
  const results: RunFfmpegResult[] = []

  if (outputFolder === '') {
    onLog('output folder is not selected.')
    return inputFileList.map((inputFilePath) => ({
      inputFilePath,
      outputFilePath: '',
      success: false,
      errorMessage: 'Output folder is not selected.'
    }))
  }

  const ffmpegPath = resolveFfmpegPath()

  for (const inputFilePath of inputFileList) {
    const outputFilePath =
      join(outputFolder, basename(inputFilePath, extname(inputFilePath))) +
      suffix +
      getExt(containerFormat)

    if (signal.aborted) {
      results.push({
        inputFilePath,
        outputFilePath,
        success: false,
        cancelled: true,
        errorMessage: 'Encoding was stopped before this file was processed.'
      })
      continue
    }

    try {
      onLog(`Start processing file: ${inputFilePath}`)
      onStatus({
        type: 'start',
        message: `Start processing file: ${inputFilePath}`,
        inputFilePath,
        outputFilePath
      })

      if (existsSync(outputFilePath)) {
        throw new Error(
          `file already exists: ${outputFilePath}\nselect suffix, or other output folder.`
        )
      }

      await runFfmpeg({
        ffmpegPath,
        inputFilePath,
        outputFilePath,
        videoCodec,
        codecOptions: codecOption,
        containerFormat,
        onLog,
        onProgress,
        signal
      })

      onLog(`Completed processing: ${inputFilePath}`)
      onStatus({
        type: 'finish',
        message: `Completed processing: ${inputFilePath}`,
        inputFilePath,
        outputFilePath
      })
      results.push({ inputFilePath, outputFilePath, success: true })
    } catch (error) {
      const errorMessage = (error as Error).message
      if (error instanceof FfmpegCancelledError) {
        onLog(errorMessage)
        results.push({
          inputFilePath,
          outputFilePath,
          success: false,
          cancelled: true,
          errorMessage
        })
        continue
      }
      console.error(`Error processing ${inputFilePath}:`, error)
      onLog(`Error processing ${inputFilePath}: ${errorMessage}`)
      onStatus({
        type: 'error',
        message: errorMessage,
        inputFilePath,
        outputFilePath
      })
      results.push({ inputFilePath, outputFilePath, success: false, errorMessage })
    }
  }

  const message = signal.aborted ? 'Encoding stopped.' : 'All files processed!'
  onLog(message)
  onStatus({
    type: signal.aborted ? 'cancelled' : 'all-finished',
    message
  })
  return results
}
