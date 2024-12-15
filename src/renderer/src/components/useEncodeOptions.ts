import {useState} from 'react'

interface EncodeOptions {
    videoCodec:string;
    codecOption:string[];
    containerFormat:string;
    suffix: string;
    outputFolder:string;
}

interface UseEncodeOptionsReturn {
    encodeOptions: EncodeOptions;
    setVideoCodec: (videocodec: string) => void;
    setCodecOption: (codecOption: string[]) => void;
    setContainerFormat: (containerFormat: string) => void;
    setSuffix: (suffix: string) => void;
    setOutputFolder: (outputFolder: string) => void;
}

const initialState: EncodeOptions = {
    videoCodec: '',
    codecOption: [],
    containerFormat: '',
    suffix: '',
    outputFolder: ''
};

export const useEncodeOptions = (): UseEncodeOptionsReturn => {
    const [encodeOptions, setEncodeOptions] = useState<EncodeOptions>(initialState);

    const setVideoCodec = (videoCodec: string) => {
        setEncodeOptions(prev => ({ ...prev, videoCodec, codecOption:[], containerFormat: '', pixelFormat:'', suffix:'' }));
    };

    const setCodecOption = (codecOption: string[]) => {
        setEncodeOptions(prev => ({ ...prev, codecOption }));
    };

    const setContainerFormat = (containerFormat: string) => {
        setEncodeOptions(prev => ({ ...prev, containerFormat }));
    };

    const setSuffix = (suffix: string) => {
        setEncodeOptions(prev => ({ ...prev, suffix }));
    };

    const setOutputFolder = (outputFolder: string) => {
        setEncodeOptions(prev => ({ ...prev, outputFolder }));
    };

    return {
        encodeOptions,
        setVideoCodec,
        setCodecOption,
        setContainerFormat,
        setSuffix,
        setOutputFolder
    }
}