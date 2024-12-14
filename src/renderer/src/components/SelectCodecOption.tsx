import * as React from 'react'
import { Autocomplete, TextField, FormControl, Box } from '@mui/material';
import switchCodecOption from './SwitchCodecOption';

interface SelectCodecOptionProps {
    onCodecOptionChange: (codecOption: string[]) => void;
    videoCodec: string;
}

const SelectCodecOption: React.FC<SelectCodecOptionProps> = ({ onCodecOptionChange, videoCodec }) => {
    
    const handleOption = (_event: React.SyntheticEvent<Element, Event>, selectedValue) => {
        onCodecOptionChange(selectedValue.option);
        window.myAPI.selectOption( selectedValue.option)
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <Autocomplete 
                    disablePortal
                    onChange={handleOption}
                    options={switchCodecOption(videoCodec)}
                    renderInput={(params) => <TextField {...params} label="Option" />}
                />
            </FormControl>
        </Box>
    )
}

export default SelectCodecOption