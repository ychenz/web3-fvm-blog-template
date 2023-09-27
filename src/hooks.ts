import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";

export const useEthersSigner = () => {
    const { isWeb3Enabled } = useMoralis();
    const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);

    const getEthersSigner = async () => {
        if (isWeb3Enabled) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            setSigner(signer);
        }
    };

    // Get signer once on first load
    useEffect(() => {
        getEthersSigner().catch(console.error);
    }, []);

    return signer;
};
