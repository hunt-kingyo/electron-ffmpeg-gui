export interface AllOptions {
  inputFileList: string[]
  videoCodec: string
  codecOption: string[]
  containerFormat: string
  suffix: string
  outputFolder: string
}

export interface FfmpegProgress {
  inputFilePath: string
  outputFilePath: string
  percent: number
  elapsedSeconds: number
  durationSeconds: number
}

export interface FfmpegStatus {
  type: 'start' | 'finish' | 'error' | 'all-finished'
  message: string
  inputFilePath?: string
  outputFilePath?: string
}

export interface RunFfmpegOptions {
  ffmpegPath: string
  inputFilePath: string
  outputFilePath: string
  videoCodec: string
  codecOptions: string[]
  containerFormat: string
  onLog: (message: string) => void
  onProgress?: (progress: FfmpegProgress) => void
}

export interface RunFfmpegResult {
  inputFilePath: string
  outputFilePath: string
  success: boolean
  errorMessage?: string
}
