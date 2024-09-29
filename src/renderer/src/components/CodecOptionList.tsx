interface codecOptionList {
    libx264: codecOption[];
    dnxhd: codecOption[];
}
interface codecOption {
    label: string;
}

const codecOptionList = {
    libx264: [
        { label: "-crf 18", id:"-crf 18"},
        { label: "-crf 20", id: "-crf 20"}, 
        { label: "-crf 22", id: "-crf 22"}
    ],
    dnxhd: [
        {label: "DNxHR 444", id: "-profile 5" }, 
        {label: "DNxHR HQX", id: "-profile 4"}, 
        {label:"DNxHR HQ", id: "-profile 3"}, 
        {label: "DNxHR SQ", id: "-profile 2"}, 
        {label: "DNxHR LQ", id: "-profile 1"}, 
        {label: "DNxHD", id: "-profile 0"}
    ],
}

export default codecOptionList




