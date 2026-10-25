import * as React from 'react'
import { Autocomplete, TextField, FormControl, Box } from '@mui/material'
import switchCodecOption from './SwitchCodecOption'

interface SelectCodecOptionProps {
  onCodecOptionChange: (codecOption: string[]) => void
  videoCodec: string
  codecOption: string[]
}

const SelectCodecOption: React.FC<SelectCodecOptionProps> = ({
  onCodecOptionChange,
  videoCodec,
  codecOption
}) => {
  const options = switchCodecOption(videoCodec)
  const value =
    options.find(
      ({ option }) =>
        option.length === codecOption.length &&
        option.every((item, index) => item === codecOption[index])
    ) ?? null

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          disabled={!videoCodec}
          value={value}
          onChange={(_event, selectedValue) => onCodecOptionChange(selectedValue?.option ?? [])}
          options={options}
          renderInput={(params) => <TextField {...params} label="Option" />}
        />
      </FormControl>
    </Box>
  )
}

export default SelectCodecOption
