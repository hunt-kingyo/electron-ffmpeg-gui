const splitOption = (option: string): string[] => {
  const matches = option.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)

  if (!matches) {
    return []
  }

  return matches.map((value) => value.replace(/^(['"])(.*)\1$/, '$2'))
}

export const normalizeCodecOptions = (codecOptions: string[]): string[] => {
  return codecOptions.flatMap((option) => splitOption(option))
}

interface BuildFfmpegArgsOptions {
  inputFilePath: string
  outputFilePath: string
  videoCodec: string
  codecOptions: string[]
  containerFormat: string
}

export const buildFfmpegArgs = ({
  inputFilePath,
  outputFilePath,
  videoCodec,
  codecOptions,
  containerFormat
}: BuildFfmpegArgsOptions): string[] => {
  return [
    '-hide_banner',
    '-y',
    '-i',
    inputFilePath,
    '-c:v',
    videoCodec,
    ...normalizeCodecOptions(codecOptions),
    '-f',
    containerFormat,
    outputFilePath
  ]
}
