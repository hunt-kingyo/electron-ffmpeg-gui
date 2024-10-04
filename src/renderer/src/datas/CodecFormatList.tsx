interface codecFormatList {
    mp4: availableCodec[]
    mov: availableCodec[]
}
interface availableCodec {
    label: string
}

const  codecFormatList = {
    libx264:[
        { label: "MP4 (MPEG-4 Part14)", id: "mp4" },
        { label: "QuickTime / MOV", id: "mov" },
    ],
    dnxhd:[
        { label: "QuickTime / MOV", id: "mov" },
        { label: "MXF OP1a", id: "mxf" },
        { label: "MXF OP-Atom", id: "mxf_opatom" },

    ]
}

export default codecFormatList