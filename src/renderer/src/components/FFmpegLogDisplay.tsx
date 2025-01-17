import React, {  useRef, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const FFmpegLogDisplay: React.FC = () => {
  const [ffmpegLog, setFFmpegLog] = React.useState<string[]>([])
  const MAX_LOG_ENTRIES = 200;

  const logContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleFFmpegLog = window.myAPI.ffmpegLog((message: string) => {
        setFFmpegLog((prevLogs) => {
            //最大行数を制限
            const updatedLogs = [...prevLogs, message]
            return updatedLogs.slice(-MAX_LOG_ENTRIES);
        });
    });
    return() => {
        handleFFmpegLog();
    }
  });

  // ログが更新されるたびに最新のログまでスクロールする
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [ffmpegLog]);

  return (
    <Paper 
        elevation={3}
        sx={{ height: 200, display: 'flex', flexDirection: 'column' }}
    >
        <Typography variant='h6' sx={{ p:2 }}>
            Logs
        </Typography>

        <Box ref={logContainerRef} sx={{ flexGrow:1, overflowY: 'auto', p:2 }}>
            {ffmpegLog.map((log, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    {log}
                </Typography>
            )
            )}
        </Box>
    </Paper>
  )
}

export default FFmpegLogDisplay