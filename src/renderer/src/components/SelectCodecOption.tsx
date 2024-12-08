import * as React from 'react'
import Box from '@mui/material/Box';
{/*import FormControl from '@mui/material/FormControl';*/}
import { Autocomplete, TextField } from '@mui/material';
import switchCodecOption from './SwitchCodecOption';
import { useEncodeOptions } from './useEncodeOptions';

interface SelectCodecOptionProps {
    onCodecOptionChange: (codecOption: string[]) => void;
}

const SelectCodecOption: React.FC<SelectCodecOptionProps> = ({ onCodecOptionChange }) => {
    const {
        encodeOptions
    } = useEncodeOptions();
    
    const handleOption = (_event: React.SyntheticEvent<Element, Event>, selectedValue) => {
        onCodecOptionChange([...encodeOptions.codecOption, selectedValue.id]);
        window.myAPI.selectCodecOption([...encodeOptions.codecOption, selectedValue.id])
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            {/*<FormControl fullWidth>*/}
                <Autocomplete 
                    disablePortal
                    onChange={handleOption}
                    options={switchCodecOption(encodeOptions.videoCodec)}
                    sx={{width: 300}}
                    renderInput={(params) => <TextField {...params} label="Option" />}
                />
            {/*</FormControl>*/}
        </Box>
    )
}

export default SelectCodecOption