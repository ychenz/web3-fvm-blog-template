import React, { useState, createContext, useContext, useEffect } from "react";
import { Button, Modal, Spin, Typography, Radio, Space } from "antd";
import type { RadioChangeEvent } from "antd";
import { useMoralis } from "react-moralis";
import { blogTablesAbi, blogTablesContractAddress } from "../constants";
import { useMutation, useQuery } from "react-query";
import { getMembershipTiers, getSite, blogSubscribe } from "../api";
import { getSiteCid } from "../helpers";
import { useEthersSigner } from "../hooks";

const { Text, Title } = Typography;

interface SubscribeModalProps {
    style?: React.CSSProperties;
    siteId: number;
}

export const SubscribeModalContext = createContext({
    isOpen: false,
    tierId: null,
    setIsOpen: (isOpen: boolean) => {},
    setTierId: (tierId: number) => {},
});

export const SubscribeModal: React.FC<SubscribeModalProps> = (props: SubscribeModalProps) => {
    const { style, siteId } = props;
    const { isWeb3Enabled } = useMoralis();
    const signer = useEthersSigner();
    const modalContext = useContext(SubscribeModalContext);

    // Price in fil
    const [selectedTierId, setSelectedTierId] = useState<number>(null);

    // Auto select tier required for the selected blog
    useEffect(() => {
        if (modalContext.tierId) {
            setSelectedTierId(modalContext.tierId);
        }
    }, [modalContext.tierId]);

    /**  Contract requests */
    const { data: tiers } = useQuery(["tiers", siteId], () => getMembershipTiers(siteId));
    const tierPrice = tiers?.find((tier) => tier.id === selectedTierId)?.tierMonthlyPrice;

    const { mutate: subscribeMutate, status: subscribeStatus } = useMutation({
        mutationFn: blogSubscribe,
        onSuccess: (res) => {
            console.log("Subscription sccessfull!");
            modalContext.setIsOpen(false);
        },
        onError: (error) => {
            console.error("Failed to subscribe to membership tier ", selectedTierId);
            console.error(error);
        },
    });

    /** Modal handlers */
    const handleCancel = () => {
        modalContext.setIsOpen(false);
    };

    const handleOk = () => {
        // call subscribe contract method
        if (isWeb3Enabled) {
            subscribeMutate({
                tierId: selectedTierId,
                tierPrice, // amount in wei
            });
        }
    };

    const onSelectTier = (e: RadioChangeEvent) => {
        setSelectedTierId(e.target.value);
    };

    return (
        <div style={style}>
            <Modal
                title="Select a subscription tier"
                open={modalContext.isOpen}
                onCancel={handleCancel}
                // disable cancel when site creation is in progress
                cancelButtonProps={{ disabled: subscribeStatus === "loading" }}
                onOk={handleOk}
                okText={subscribeStatus === "loading" ? "Working..." : "Continue to Payment"}
                confirmLoading={subscribeStatus === "loading"}
                okButtonProps={{ disabled: !tiers || tiers.length < 1 || !selectedTierId }}
                maskClosable={false}
            >
                <br />
                {tiers && signer ? (
                    <Radio.Group
                        onChange={onSelectTier}
                        value={selectedTierId || modalContext.tierId}
                    >
                        <Space direction="vertical">
                            {tiers?.map((tier) => (
                                <Radio key={tier.id} value={tier.id}>
                                    {tier.tierName} - {tier.tierDescription}, FIL{" "}
                                    {tier.tierMonthlyPrice / 1e18} / month
                                </Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                ) : (
                    <div className="Spinner-container">
                        <Spin />
                    </div>
                )}
            </Modal>
        </div>
    );
};
