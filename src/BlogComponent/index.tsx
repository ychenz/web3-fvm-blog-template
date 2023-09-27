import React, { useContext, useEffect } from "react";
import { Blog } from "../types";
import { Typography, Button } from "antd";
import { useMoralis } from "react-moralis";
import { getEncryptedLighthouseURL, getLighthouseURL } from "../helpers";
import { SubscribeModalContext } from "../SubscribeModal";
import { getUserSubscriptions, unlockBlogRequest } from "../api";
import { useMutation, useQuery } from "react-query";
import "./styles.css";

const { Title, Link, Text } = Typography;

export const BlogComponent = (props: {
    blog: Blog;
    activeTierIds: number[];
}): React.ReactElement => {
    const { blog, activeTierIds } = props;
    const { isWeb3Enabled, account } = useMoralis();
    const modalContext = useContext(SubscribeModalContext);

    /** API requests */
    const { mutate: unlockBlogMutate, status: unlockBlogMutateStatus } = useMutation({
        mutationFn: unlockBlogRequest,
        onSuccess: (data) => {
            console.log("unlockBlog success!");
            console.log(data);
        },
        onError: (error) => {
            console.error("unlockBlog Filed!");
            console.error(error);
        },
    });

    const onSubscribeClick = () => {
        if (isWeb3Enabled) {
            modalContext.setTierId(blog.creatorMembershipTierId);
            modalContext.setIsOpen(true);
        }
    };

    const unlockButtonClicked = (blogCid: string) => {
        unlockBlogMutate({
            userAddress: account,
            blogCid: blogCid,
        });
    };

    return (
        <div className="Blog-container">
            <Title level={3}>{blog.blogName}</Title>
            {!blog.creatorMembershipTierId ? (
                <Link href={getLighthouseURL(blog.blogCid)} target="_blank">
                    {blog.blogCid}
                </Link>
            ) : (
                <>
                    {/* If user not subcribed to the required membership tier */}
                    {activeTierIds.length === 0 ||
                    !activeTierIds.includes(blog.creatorMembershipTierId) ? (
                        <Button onClick={onSubscribeClick}>Subscribe to view this blog</Button>
                    ) : (
                        <div className="Blog-paid_url_container">
                            <Link href={getEncryptedLighthouseURL(blog.blogCid)} target="_blank">
                                {blog.blogCid}
                            </Link>
                            {/* Unlock button triggers lighthouse file sharing (if user has active subscription) */}
                            <Button
                                disabled={unlockBlogMutateStatus === "loading"}
                                loading={unlockBlogMutateStatus === "loading"}
                                onClick={() => unlockButtonClicked(blog.blogCid)}
                            >
                                Unlock
                            </Button>
                        </div>
                    )}
                </>
            )}
            <br />
        </div>
    );
};
