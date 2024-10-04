interface FormatExtMap {
    key:string
}

const  FormatExtMap = {
    "mp4" : ".mp4",
    "mov" : ".mov",
    "mxf" : ".mxf",
    "mxf_opatom" : ".mxf",
}

type ExtensionMap = typeof FormatExtMap

const getExt = (format: string): ExtensionMap[] => {
    return FormatExtMap[format];
}

export default getExt