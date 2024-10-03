import * as React from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type CodecSelectProps = {
    setCodec: React.Dispatch<React.SetStateAction<string>>
    selectedCodec: string
    setOption: React.Dispatch<React.SetStateAction<string[]>>
    setFormat: React.Dispatch<React.SetStateAction<string>>
}

const CodecSelectMUI: React.FC<CodecSelectProps> = ({ selectedCodec, setCodec, setOption, setFormat }) => {
    const handleCodec = (event: SelectChangeEvent) => {
        setCodec(event.target.value as string);
        setOption([]);
        setFormat('');
        window.myAPI.selectCodec(event.target.value as string);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="select-codec-label">Codec</InputLabel>
                <Select 
                    labelId='select-codec-label'
                    id="codecSelect"
                    label="Codec"
                    value={selectedCodec}
                    onChange={handleCodec}
                    >
                    
                    <MenuItem value="h264_nvenc">NVIDIA NVENC H.264</MenuItem>
                    <MenuItem value="hevc_nvenc">NVIDIA NVENC H.265</MenuItem>
                    <MenuItem value="av1_nvenc">NVIDIA NVENC av1</MenuItem>
                    <MenuItem value="libx264">H.264</MenuItem>
                    <MenuItem value="libx265">H.265</MenuItem>
                    <MenuItem value="ilbvpx-vp9">libvpx VP9</MenuItem>
                    <MenuItem value="libsvtav1">SVT-AV1</MenuItem>
                    <MenuItem value="dnxhd">DNxHR</MenuItem>
                    <MenuItem value="cfhd">GoPro CineForm HD</MenuItem>
                    <MenuItem value="prores_ks">Apple ProRes(iCodec Pro)</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}

export default CodecSelectMUI