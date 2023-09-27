import React, { useEffect, useState } from "react";
import { Spin, theme, Typography } from "antd";
import { StarTwoTone } from "@ant-design/icons";
import { useMoralis } from "react-moralis";
import { ConnectWalletButton } from "./ConnectWalletButton";
import "./App.css";
import { ethers } from "ethers";
import { Blog, BlogSite } from "./types";
import { getBlogs, getMembershipTiers, getSite, getSubInfo, getUserSubscriptions } from "./api";
import { BlogComponent } from "./BlogComponent";
import { getSiteCid } from "./helpers";
import { SubscribeModalContext, SubscribeModal } from "./SubscribeModal";
import { useQuery } from "react-query";

const { Title, Text } = Typography;

const App: React.FC = () => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const { isWeb3Enabled } = useMoralis();

    const [site, setSite] = useState<BlogSite>(null);
    const [blogs, setBlog] = useState<Blog[]>([]);

    // Subscribe modal context values
    const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState<boolean>(false);
    const [subModalTierId, setSubModalTierId] = useState<number>(null);

    /**  Contract requests */
    const { data: tiers } = useQuery(["tiers", site?.id], () => getMembershipTiers(site?.id));
    const { data: subs } = useQuery(["userSubscriptions"], getUserSubscriptions);

    const currentSubscriptions =
        tiers?.length > 0 && subs?.length > 0
            ? subs.map((sub) => tiers.find((tier) => tier.id === sub.creatorMembershipTierId))
            : [];
    const activeTierIds = currentSubscriptions.map((s) => s.id) || [];

    useEffect(() => {
        console.log("Fetching blogs");
        const fetchBlogs = async () => {
            if (isWeb3Enabled) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const siteCid = getSiteCid(window.location.href);

                const site = (await getSite(signer, siteCid)) as BlogSite;
                const blogs = await getBlogs(signer, site.id);
                console.log(`Current site: ${siteCid}`);
                console.log(`Current site owner: ${site.owner}`);
                console.log(`Fetched ${blogs?.length} blogs`);

                setSite(site);
                setBlog(blogs);
            }
        };

        fetchBlogs().catch(console.error);
    }, [isWeb3Enabled]);

    return (
        <div className="App">
            <header className="Header-container">
                {site ? <Title>{site.name}</Title> : <Spin />}

                <div className="Header-right">
                    {/* Display current subscription status */}
                    {currentSubscriptions.length > 0 ? (
                        <div style={{ marginRight: 16 }}>
                            <StarTwoTone style={{ marginRight: 4 }} twoToneColor="#FFBF00" />
                            <Text>{currentSubscriptions.map((s) => s.tierName).join()}</Text>
                        </div>
                    ) : null}
                    <ConnectWalletButton />
                </div>
            </header>

            <SubscribeModalContext.Provider
                value={{
                    isOpen: isSubscribeModalOpen,
                    tierId: subModalTierId,
                    setIsOpen: setIsSubscribeModalOpen,
                    setTierId: setSubModalTierId,
                }}
            >
                {blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <BlogComponent key={blog.id} blog={blog} activeTierIds={activeTierIds} />
                    ))
                ) : (
                    <Spin />
                )}
                {site?.id && <SubscribeModal siteId={site.id} />}
            </SubscribeModalContext.Provider>
        </div>
    );
};

export default App;
