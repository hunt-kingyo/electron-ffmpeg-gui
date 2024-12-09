import * as React from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


interface SelectVideoCodecProps {
    onVideoCodecChange: (videoCodec: string) => void;
    videoCodec: string;
}

const SelectVideoCodec: React.FC<SelectVideoCodecProps> = ({ onVideoCodecChange, videoCodec }) => {
    const handleCodec = (event: SelectChangeEvent) => {
        onVideoCodecChange(event.target.value as string);
        window.myAPI.selectCodec(event.target.value as string);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="select-codec-label">Codec</InputLabel>
                <Select 
                    labelId='select-codec-label'
                    id="codecSelect"
                    label='Codec'
                    value={videoCodec}
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

export default SelectVideoCodec