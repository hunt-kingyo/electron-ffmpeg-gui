import codecOptionList from '../datas/CodecOptionList'

const switchCodecOption = (selectedCodec: string): { label: string; option: string[] }[] => {
  if (!Object.hasOwn(codecOptionList, selectedCodec)) return []
  return codecOptionList[selectedCodec as keyof typeof codecOptionList]
}

export default switchCodecOption
