import * as React from 'react'
import Box from '@mui/material/Box';
import { Autocomplete, TextField } from '@mui/material';
import SwitchCodecFormat from './SwitchCodecFormat';

type SelectFormatProps = {
    setFormat: React.Dispatch<React.SetStateAction<string>>
    selectedCodec: string
}

const SelectFormat: React.FC<SelectFormatProps> = ({ setFormat, selectedCodec }) => {
    const handleFormat = (_event: React.SyntheticEvent<Element, Event>, format) => {
        setFormat(format.id);
        window.myAPI.selectFormat(format.id)
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            {/*<FormControl fullWidth>*/}
                <Autocomplete 
                    disablePortal
                    onChange={handleFormat}
                    options={SwitchCodecFormat(selectedCodec)}
                    sx={{width: 300}}
                    renderInput={(params) => <TextField {...params} label="Format" />}
                />
            {/*</FormControl>*/}
        </Box>
    )
}

export default SelectFormat