export const getMaskedWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
};

export const getLighthouseURL = (fileCid: string) => {
    return `https://gateway.lighthouse.storage/ipfs/${fileCid}`;
};

export const getEncryptedLighthouseURL = (fileCid: string) => {
    return `https://decrypt.mesh3.network/${fileCid}`;
};

export const getSiteCid = (url: string) => {
    // Split the URL by "/" and get the second last element
    if (url === "http://localhost:3002/") {
        // TODO: Replace this with your own test site CID
        // return "QmcHUSx8285V4ZXwXX75SN5CqhaDkdFaP7RbkU4A4tqjeZ";
        return "QmUYCcRxGbXauKpN8hZCkByMGsGX1wW8YTVE7yjfhsTogR";
    } else {
        const siteCid = url.split("/")[url.split("/").length - 2];

        return siteCid;
    }
};
