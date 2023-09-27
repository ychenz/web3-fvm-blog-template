import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Button } from "antd";
import "./styles.css";
import { getMaskedWalletAddress } from "../helpers";

export const ConnectWalletButton = (): React.ReactElement => {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis();
    // some button that connects us and changes connected to be true

    useEffect(() => {
        if (isWeb3Enabled) return;
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3();
            }
        }
    }, [isWeb3Enabled]);
    // no dependecy array: run anytime something re-renders
    // CAREFUL with this!! Because then you can get circular render
    // blank dependency array, run once on load / rerender
    // dependencies in the array, run anytime something in there changes

    useEffect(() => {
        Moralis.onAccountChanged((account: string | null) => {
            console.log(`Account changed to ${account}`);
            if (account == null) {
                window.localStorage.removeItem("connected");
                deactivateWeb3();
                console.log("Null account found");
            }
        });
    }, []);

    return (
        <div>
            {account ? (
                <div>Connected to {getMaskedWalletAddress(account)}</div>
            ) : (
                <Button
                    className="connect-button"
                    onClick={async () => {
                        await enableWeb3();
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected");
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect Wallet
                </Button>
            )}
        </div>
    );
};
