let codecOptionList: {
    libx264: string[];
    dnxhd: string[];
};

// eslint-disable-next-line prefer-const
codecOptionList = {
    libx264: ["-crf 18", "-crf 20", "-crf 22"],
    dnxhd: ["-profile 5", "-profile 4", "-profile 3", "-profile 2", "-profile 1", "-profile 0"],
}

export default codecOptionList




