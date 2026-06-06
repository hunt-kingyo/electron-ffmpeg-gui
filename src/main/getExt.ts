const formatExtMap = {
  mp4: '.mp4',
  mov: '.mov',
  mxf: '.mxf',
  mxf_opatom: '.mxf',
  webm: '.webm'
} as const

type FormatName = keyof typeof formatExtMap

const getExt = (format: string): string => {
  return formatExtMap[format as FormatName] ?? ''
}

export default getExt
