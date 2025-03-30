import * as React from 'react'
import {Box, InputLabel, MenuItem, FormControl} from '@mui/material';
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
                    label='Codec'
                    value={videoCodec}
                    onChange={handleCodec}
                    >
                    <MenuItem value="libx264">H.264</MenuItem>
                    <MenuItem value="libx265">H.265</MenuItem>
                    <MenuItem value="libvpx">libvpx VP8</MenuItem>
                    <MenuItem value="libsvtav1">SVT-AV1: N/A</MenuItem>
                    <MenuItem value="h264_nvenc">NVENC H.264</MenuItem>
                    <MenuItem value="dnxhd">DNxHR</MenuItem>
                    <MenuItem value="prores_ks">Apple ProRes(iCodec Pro)</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}

export default SelectVideoCodec