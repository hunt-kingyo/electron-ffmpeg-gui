interface codecFormatList {
    codec: availableFormat[]
}
interface availableFormat {
    label: string
}

const  codecFormatList = {
    libx264:[
        { label: "MP4 (MPEG-4 Part14)", id: "mp4" },
        { label: "QuickTime / MOV", id: "mov" },
    ],
    libx265:[
        { label: "MP4 (MPEG-4 Part14)", id:"mp4" },
        { label: "QuickTime / MOV", id:"mov" },
    ],
    libvpx: [
        { label: "WebM", id: "webm" },
    ],
    libsvtav1:[
        { label: "MP4 (MPEG-4 Part14)", id:"mp4" },
        { label: "WebM", id: "webm" },
    ],
    h264_nvenc: [
        { label: "MP4 (MPEG-4 Part14)", id: "mp4" },
        { label: "QuickTime / MOV", id: "mov" },
    ],
    dnxhd:[
        { label: "QuickTime / MOV", id: "mov" },
        { label: "MXF OP1a", id: "mxf" },
        { label: "MXF OP-Atom", id: "mxf_opatom" },
    ],
    prores_ks: [
        { label: "QuickTime / MOV", id: "mov" },
       // { label: "MXF OP1a", id: "mxf" },だめそう
    ]
}

export default codecFormatList