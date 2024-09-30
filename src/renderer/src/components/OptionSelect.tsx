import * as React from 'react'
import Box from '@mui/material/Box';
{/*import FormControl from '@mui/material/FormControl';*/}
import { Autocomplete, TextField } from '@mui/material';
import switchCodecOption from './SwitchCodecOption';


type OptionSelectProps = {
    setOption: React.Dispatch<React.SetStateAction<string>>
    selectedOption: string
    selectedCodec: string
}

const CodecSelect: React.FC<OptionSelectProps> = ({ selectedCodec, setOption }) => {
    const handleOption = (_event: React.SyntheticEvent<Element, Event>, selectedValue) => {
        setOption(selectedValue.id);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            {/*<FormControl fullWidth>*/}
                <Autocomplete 
                    disablePortal
                    onChange={handleOption}
                    options={switchCodecOption(selectedCodec)}
                    sx={{width: 300}}
                    renderInput={(params) => <TextField {...params} label="Option" />}
                />
            {/*</FormControl>*/}
        </Box>
    )
}

export default CodecSelect