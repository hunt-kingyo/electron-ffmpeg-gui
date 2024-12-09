import * as React from 'react'
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { Autocomplete, TextField } from '@mui/material';
import switchCodecOption from './SwitchCodecOption';

interface SelectCodecOptionProps {
    onCodecOptionChange: (codecOption: string[]) => void;
    videoCodec: string;
    codecOption: string[]
}

const SelectCodecOption: React.FC<SelectCodecOptionProps> = ({ onCodecOptionChange, videoCodec, codecOption }) => {
    
    const handleOption = (_event: React.SyntheticEvent<Element, Event>, selectedValue) => {
        onCodecOptionChange([...codecOption, selectedValue.id]);
        window.myAPI.selectCodecOption([...codecOption, selectedValue.id])
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <Autocomplete 
                    disablePortal
                    onChange={handleOption}
                    options={switchCodecOption(videoCodec)}
                    sx={{width: 300}}
                    renderInput={(params) => <TextField {...params} label="Option" />}
                />
            </FormControl>
        </Box>
    )
}

export default SelectCodecOption