import React from 'react'
import { Box, Paper, List, ListItem, ListItemText, Divider, Typography } from '@mui/material'
//import  IconButton from '@mui/material'
//import ClearIcon from '@mui/icons-material/Clear'

interface InputListDisplayProps {
    inputFileList: string[]
    setInputList: (inputFileList: string[]) => void;
}

const InputListDisplay: React.FC<InputListDisplayProps> = ({ inputFileList/*, setInputList*/ }) => {
    /*const deleteFile = (filePath: string) => {
        setInputList(inputFileList.filter((path) => path != filePath));
        console.log(inputFileList)
    }*/
    
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
                    height: 360,
                    flexGrow: 1,
                    overflowY: 'auto',
                    paddingY: 1
                }}
            >
                {inputFileList.length > 0 ? (
                    <List sx={style}>
                        {inputFileList.map((filePath) => (
                            <React.Fragment key={filePath}>
                                <ListItem>
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

//listitemを削除する機能の名残：listitemの<>内に記述
/*secondaryAction={
    <IconButton 
        onClick={() => deleteFile(filePath)}
    >
        <ClearIcon />
    </IconButton>
}*/