import codecFormatList from '../datas/CodecFormatList'

type CodecLists = {
    codec: string;
};

const SwitchCodecFormat = (selectedCodec) => {
    const codecName: keyof CodecLists = selectedCodec
    if (selectedCodec != '') {
        return codecFormatList[codecName]
    }else{
        return [{label: 'Select codec first', option: ''}]
    }

}

export default SwitchCodecFormat