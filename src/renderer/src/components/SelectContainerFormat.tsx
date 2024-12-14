import * as React from 'react';
import Box from '@mui/material/Box';
import { Autocomplete, TextField, FormControl } from '@mui/material';
import SwitchCodecFormat from './SwitchCodecFormat';


interface SelectContainerFormatProps {
    onContainerFormatChange: (containerFormat: string) => void;
    videoCodec: string;
}

const SelectContainerFormat: React.FC<SelectContainerFormatProps> = ({ onContainerFormatChange, videoCodec }) => {
    
    const handleFormat = (_event: React.SyntheticEvent<Element, Event>, format) => {
        onContainerFormatChange(format.id);
        window.myAPI.selectFormat(format.id)
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <Autocomplete 
                    disablePortal
                    onChange={handleFormat}
                    options={SwitchCodecFormat(videoCodec)}
                    renderInput={(params) => <TextField {...params} label="Format" />}
                />
            </FormControl>
        </Box>
    )
}

export default SelectContainerFormat