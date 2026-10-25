import * as React from 'react'
import Box from '@mui/material/Box'
import { Autocomplete, TextField, FormControl } from '@mui/material'
import SwitchCodecFormat from './SwitchCodecFormat'

interface SelectContainerFormatProps {
  onContainerFormatChange: (containerFormat: string) => void
  videoCodec: string
  containerFormat: string
}

const SelectContainerFormat: React.FC<SelectContainerFormatProps> = ({
  onContainerFormatChange,
  videoCodec,
  containerFormat
}) => {
  const options = SwitchCodecFormat(videoCodec)
  const value = options.find(({ id }) => id === containerFormat) ?? null

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          disabled={!videoCodec}
          value={value}
          onChange={(_event, format) => onContainerFormatChange(format?.id ?? '')}
          options={options}
          renderInput={(params) => <TextField {...params} label="Format" />}
        />
      </FormControl>
    </Box>
  )
}

export default SelectContainerFormat
