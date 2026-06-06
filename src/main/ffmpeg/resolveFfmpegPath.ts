import ffmpegStatic from 'ffmpeg-static'

export const resolveFfmpegPath = (): string => {
  if (!ffmpegStatic) {
    throw new Error('ffmpeg binary was not found.')
  }

  return ffmpegStatic.replace('app.asar', 'app.asar.unpacked')
}
