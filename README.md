# electron-ffmpeg-gui

FFmpeg GUI for converting video codecs.

If the window fails to render with OpenGL / EGL initialization errors, try software rendering:

```bash
FFMPEG_GUI_DISABLE_GPU=1 npm run dev
```

This setting disables Electron's hardware acceleration for the GUI. 
