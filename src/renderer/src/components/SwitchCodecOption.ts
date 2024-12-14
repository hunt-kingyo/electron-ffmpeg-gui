import codecOptionList from '../datas/CodecOptionList'

type CodecLists = {
    codec: string[];
};

const switchCodecOption = (selectedCodec) => {
    const codecName: keyof CodecLists = selectedCodec
    if (selectedCodec != '') {
        return codecOptionList[codecName]
    }else{
        return [{label: 'Select codec first', id: ''}]
    }

}

export default switchCodecOption