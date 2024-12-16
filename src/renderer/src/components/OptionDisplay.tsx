import { Paper, List, ListItem, ListItemText/*, Box, Divider*/ } from '@mui/material';
import React from 'react'

interface EncodeOptions {
    videoCodec:string;
    codecOption:string[];
    containerFormat:string;
    suffix: string;
    outputFolder:string;
  }

interface OptionDisplayProps {
    encodeOptions: EncodeOptions
}

const OptionDisplay: React.FC<OptionDisplayProps> = ({encodeOptions}) => {
    const style = {
        py: 0,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        borderRadius: 2
    }

    /*const codecOptionStyle = {
        height: "calc(1.5rem * 4)", // 1行の高さ (lineHeight) × 4行分
        overflowY: "auto",         // テキストが4行以上でも隠れるように
        lineHeight: "1.5rem",       // 行間
        display: "flex",            // 子要素の配置を柔軟に
        alignItems: "center",       // 中央揃え
    }*/

    const outputFolderStyle = {
        height: "calc(1.5rem * 2)", // 1行の高さ (lineHeight) × 2行分
        overflowY: "auto",         // テキストが4行以上でも隠れるように
        lineHeight: "1.5rem",       // 行間
        display: "flex",            // 子要素の配置を柔軟に
        alignItems: "center",       // 中央揃え
    }



    return(
        <Paper elevation={3} sx={{borderRadius: 2}}>
            <List sx={style}>
                {/*<ListItem><ListItemText primary={'Codec:'} /><Box sx={{flexGrow: 1}}></Box><ListItemText primary={encodeOptions.videoCodec} /></ListItem>
                <Divider component={"li"} />
                <ListItem><ListItemText primary={'Option:'} /><Box sx={{flexGrow: 1}}></Box><ListItemText sx={codecOptionStyle} primary={encodeOptions.codecOption.map((option) => <div key={option}>{option}</div>)} /></ListItem>
                <Divider component={"li"} />
                <ListItem><ListItemText primary={'Format:'} /><Box sx={{flexGrow: 1}}></Box><ListItemText primary={encodeOptions.containerFormat}  /></ListItem>
                <Divider component={"li"} />
                <ListItem><ListItemText primary={'Suffix:'} /><Box sx={{flexGrow: 1}}></Box><ListItemText primary={encodeOptions.suffix}  /></ListItem>
                <Divider component={"li"} />*/}
                <ListItem><ListItemText sx={outputFolderStyle} primary={encodeOptions.outputFolder}  /></ListItem>
            </List>
        </Paper>
    )
}

export default OptionDisplay