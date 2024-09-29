import * as React from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Autocomplete, TextField } from '@mui/material';
import switchCodecOption from './CodecOptionObject';

type OptionSelectProps = {
    setOption: React.Dispatch<React.SetStateAction<string>>
    selectedOption: string
    selectedCodec: string
    selectedValue: {label:string, id:string}
}

const CodecSelect: React.FC<OptionSelectProps> = ({ selectedCodec, selectedValue, setOption }) => {
    const handleOption = (event: React.SyntheticEvent<Element, Event>, selectedValue: { label: string; id: string } | null) => {
        setOption(selectedValue.id);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <Autocomplete 
                    disablePortal
                    value={selectedValue}
                    onChange={handleOption}
                    options={switchCodecOption(selectedCodec)}
                    sx={{width: 300}}
                    renderInput={(params) => <TextField {...params} label="Codec" />}
                />
            </FormControl>
        </Box>
    )
}

export default CodecSelect