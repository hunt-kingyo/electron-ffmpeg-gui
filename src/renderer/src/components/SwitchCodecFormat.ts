import codecFormatList from '../datas/CodecFormatList'

type CodecLists = {
    libx264: string[];
    dnxhd: string[];
};

const SwitchCodecFormat = (selectedCodec) => {
    const codecName: keyof CodecLists = selectedCodec
    if (selectedCodec != '') {
        return codecFormatList[codecName]
    }else{
        return [{label: 'Select codec first', id: ''}]
    }

}

export default SwitchCodecFormat