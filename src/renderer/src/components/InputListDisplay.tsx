import React from 'react'
import { Box, Paper, List, ListItem, ListItemText, Divider, Button, Typography } from '@mui/material'

interface InputListDisplayProps {
    inputFileList: string[]
    setInputList: (inputFileList: string[]) => void;
}

const InputListDisplay: React.FC<InputListDisplayProps> = ({ inputFileList, setInputList }) => {
    const deleteFile = (filePath: string) => {
        setInputList(inputFileList.filter((path) => path !== filePath));
    }
    
    const style = {
        py: 0,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
    }

    return(
        <Paper elevation={3} sx={{borderRadius: 2}}>
            <Box
                sx={{
                    height: 300,
                    flexGrow: 1,
                    overflowY: 'auto',
                    paddingY: 1
                }}
            >
                {inputFileList.length > 0 ? (
                    <List sx={style}>
                        {inputFileList.map((filePath) => (
                            <React.Fragment key={filePath}>
                                <ListItem
                                    secondaryAction={
                                        <Button 
                                            variant="outlined" 
                                            color="error" 
                                            onClick={() => deleteFile(filePath)}
                                        >
                                            Remove
                                        </Button>
                                    }
                                >
                                    <ListItemText primary={filePath} />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography>No files selected</Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    )
}

export default InputListDisplay