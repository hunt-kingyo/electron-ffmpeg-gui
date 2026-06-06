import { ElectronAPI } from '@electron-toolkit/preload'

interface AllOptions {
  inputFileList: string[]
  videoCodec: string
  codecOption: string[]
  containerFormat: string
  suffix: string
  outputFolder: string
}

interface RunFfmpegResult {
  inputFilePath: string
  outputFilePath: string
  success: boolean
  errorMessage?: string
}

interface FfmpegProgress {
  inputFilePath: string
  outputFilePath: string
  percent: number
  elapsedSeconds: number
  durationSeconds: number
}

interface FfmpegStatus {
  type: 'start' | 'finish' | 'error' | 'all-finished'
  message: string
  inputFilePath?: string
  outputFilePath?: string
}

interface MyAPI {
  openMultipleDialog: () => Promise<string[] | ''>
  openOutputDialog: () => Promise<string | undefined>
  selectCodec: (codec: string) => void
  selectSuffix: (suffix: string) => void
  selectOption: (option: string[]) => void
  selectFormat: (format: string) => void
  startFfmpeg: (allOptions: AllOptions) => Promise<RunFfmpegResult[]>
  ffmpegLog: (callback: (message: string) => void) => () => void
  ffmpegProgress: (callback: (progress: FfmpegProgress) => void) => () => void
  ffmpegStatus: (callback: (status: FfmpegStatus) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    myAPI: MyAPI
  }
}
