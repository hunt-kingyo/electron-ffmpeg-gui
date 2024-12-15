import * as React from 'react'
import {Box, InputLabel, MenuItem, FormControl} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectSuffixProps {
    onSuffixChange: (suffix: string) => void;
    suffix: string;
    videoCodec: string;
}

const SelectSuffix: React.FC<SelectSuffixProps> = ({ onSuffixChange, suffix, videoCodec }) => {
    const handleSuffix = (event: SelectChangeEvent) => {
        onSuffixChange(event.target.value as string);
    }
    const codecSuffix:string = '_'+ videoCodec

    return (
        <Box sx={{ minWidth: 120}}>
            <FormControl fullWidth>
                <InputLabel id="select-suffix-label">Suffix</InputLabel>
                <Select 
                    labelId='select-suffix-label'
                    label='Suffix'
                    value={suffix}
                    onChange={handleSuffix}
                    >
                    <MenuItem value='_converted'>_converted</MenuItem>
                    <MenuItem value={codecSuffix}>{codecSuffix}</MenuItem>
                    <MenuItem value='_FFmpegGUI'>_FFmpegGUI</MenuItem>
                    </Select>
            </FormControl>
        </Box>
    )
}

export default SelectSuffix