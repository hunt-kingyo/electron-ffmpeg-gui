import React, {useState} from 'react'

const [selectedCodec, setCodec] = React.useState<string>('')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [_selectedOption, setOption] = React.useState<string[]>([])
const [selectedFormat, setFormat] = React.useState<string>('')
const [outputFolder, setOutputFolder] = React.useState<string>('')

interface EncodeOptions {
    videoCodec:string
    option:string
    format:string
    pixelFormat:string
    videoBitrate:string
    outputFolder:string
}

export const useEncodeOptions = (
    
)