interface codecOptionList {
    codec: codecOption[];
}
interface codecOption {
    label: string;
    option: string[];
}

const codecOptionList = {
    libx264: [
        { label: "-crf 18", option:["-crf 18"]},
        { label: "-crf 23", option: ["-crf 23"]}, 
        { label: "-crf 30", option: ["-crf 30"]}
    ],
    libx265: [
        { label: "-crf 24", option: ["-crf 24"] },
        { label: "-crf 28", option: ["-crf 28"] },
    ],
    libvpx: [
        { label: "-crf 10 with alpha Max:20Mbps", option: ["-b:v 20M", "-crf 10", "-auto-alt-ref 0", "-pix_fmt yuva420p"] },
        { label: "-crf 10 with alpha Max:2Mbps", option: ["-b:v 2M", "-crf 10", "-auto-alt-ref 0", "-pix_fmt yuva420p"] },
        { label: "-crf 10 with alpha Max:1Mbps", option: ["-b:v 1M", "-crf 10", "-auto-alt-ref 0", "-pix_fmt yuva420p"] },
    ],
    libsvtav1: [
        { label: "-crf 10", option: ["-crf 10"] },
        { label: "-crf 20", option: ["-crf 20"] },
        { label: "-crf 30", option: ["-crf 30"] },
    ],
    dnxhd: [
        {label: "DNxHR 444 with alpha", option: ["-profile 5", "-pix_fmt yuva444p10le"] }, 
        {label: "DNxHR HQX 10bit", option: ["-profile 4", "-pix_fmt yuv422p10le"]}, 
        {label:"DNxHR HQ 8bit", option: ["-profile 3", "-pix_fmt yuv422p"]}, 
        {label: "DNxHR SQ", option: ["-profile 2"]}
    ],
    prores_ks: [
        { label: "ProRes 4444 with alpha", option: ["-profile 4", "-pix_fmt yuva444p10le"] },
        { label: "ProRes 422 HQ 10bit", option: ["-profile 3", "-pix_fmt yuv422p10le"] },
        { label: "ProRes 422 HQ 8bit", option: ["-profile 3", "-pix_fmt yuv422p"] },
    ],

}

export default codecOptionList




