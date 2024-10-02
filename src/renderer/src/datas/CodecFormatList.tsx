interface codecFormatList {
    mp4: availableCodec[]
    mov: availableCodec[]
}
interface availableCodec {
    label: string
}

const  codecFormatList = {
    libx264:[
        { label: "mp4", id: "MP4 (MPEG-4 Part14)" },
        { label: "mov", id: "QuickTime / MOV" },
    ],
    dnxhd:[
        { label: "mov", id: "QuickTime / MOV" },
        { label: "mxf", id: "MXF OP1a" },
        { label: "mxf_opatom", id: "MXF OP-Atom" },

    ]
}

export default codecFormatList