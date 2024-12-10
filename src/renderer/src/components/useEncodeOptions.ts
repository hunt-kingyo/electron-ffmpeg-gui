import {useState} from 'react'

interface EncodeOptions {
    videoCodec:string;
    codecOption:string;
    containerFormat:string;
    pixelFormat:string;
    videoBitrate:string;
    suffix: string;
    outputFolder:string;
}

interface UseEncodeOptionsReturn {
    encodeOptions: EncodeOptions;
    setVideoCodec: (videocodec: string) => void;
    setCodecOption: (codecOption: string) => void;
    setContainerFormat: (containerFormat: string) => void;
    setPixelFormat: (pixelFormat: string) => void;
    setVideoBitrate: (videoBitrate: string) => void;
    setSuffix: (suffix: string) => void;
    setOutputFolder: (outputFolder: string) => void;
}

const initialState: EncodeOptions = {
    videoCodec: '',
    codecOption: '',
    containerFormat: '',
    pixelFormat: '',
    videoBitrate: '',
    suffix: '',
    outputFolder: ''
};

export const useEncodeOptions = (): UseEncodeOptionsReturn => {
    const [encodeOptions, setEncodeOptions] = useState<EncodeOptions>(initialState);

    const setVideoCodec = (videoCodec: string) => {
        setEncodeOptions(prev => ({ ...prev, videoCodec, codecOption:'', containerFormat: '', pixelFormat:'' }));
    };

    const setCodecOption = (codecOption: string) => {
        setEncodeOptions(prev => ({ ...prev, codecOption }));
    };

    const setContainerFormat = (containerFormat: string) => {
        setEncodeOptions(prev => ({ ...prev, containerFormat }));
    };

    const setPixelFormat = (pixelFormat: string) => {
        setEncodeOptions(prev => ({ ...prev, pixelFormat }));
    };

    const setVideoBitrate = (videoBitrate: string) => {
        setEncodeOptions(prev => ({ ...prev, videoBitrate }));
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
        setPixelFormat,
        setVideoBitrate,
        setSuffix,
        setOutputFolder
    }
}