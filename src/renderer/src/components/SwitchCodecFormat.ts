import codecFormatList from '../datas/CodecFormatList'

const SwitchCodecFormat = (selectedCodec: string): { label: string; id: string }[] => {
  if (!Object.hasOwn(codecFormatList, selectedCodec)) return []
  return codecFormatList[selectedCodec as keyof typeof codecFormatList]
}

export default SwitchCodecFormat
