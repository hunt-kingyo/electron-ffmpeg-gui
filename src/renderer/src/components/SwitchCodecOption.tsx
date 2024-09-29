import codecOptionList from '../datas/CodecOptionList'

type CodecLists = {
    libx264: string[];
    dnxhd: string[];
};

const switchCodecOption = (selectedCodec) => {
    const codecName: keyof CodecLists = selectedCodec
    return codecOptionList[codecName]
}

export default switchCodecOption