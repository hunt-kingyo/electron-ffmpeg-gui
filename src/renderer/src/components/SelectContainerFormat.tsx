import * as React from 'react'
import Box from '@mui/material/Box';
import { Autocomplete, TextField } from '@mui/material';
import SwitchCodecFormat from './SwitchCodecFormat';
import { useEncodeOptions } from './useEncodeOptions';

interface SelectContainerFormatProps {
    onContainerFormatChange: (containerFormat: string) => void;
}

const SelectContainerFormat: React.FC<SelectContainerFormatProps> = ({ onContainerFormatChange }) => {
    const {
        encodeOptions
    } = useEncodeOptions();
    
    const handleFormat = (_event: React.SyntheticEvent<Element, Event>, format) => {
        onContainerFormatChange(format.id);
        window.myAPI.selectFormat(format.id)
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            {/*<FormControl fullWidth>*/}
                <Autocomplete 
                    disablePortal
                    onChange={handleFormat}
                    options={SwitchCodecFormat(encodeOptions.videoCodec)}
                    sx={{width: 300}}
                    renderInput={(params) => <TextField {...params} label="Format" />}
                />
            {/*</FormControl>*/}
        </Box>
    )
}

export default SelectContainerFormat