import React from 'react'

const [selectedCodec, setCodec] = React.useState<string>('')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [_selectedOption, setOption] = React.useState<string[]>([])
const [selectedFormat, setFormat] = React.useState<string>('')
const [outputFolder, setOutputFolder] = React.useState<string>('')

interface EncodeOptions {
    
}

export const useEncodeOptions = ()