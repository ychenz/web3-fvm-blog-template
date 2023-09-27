import { Database } from "@tableland/sdk";
import { ethers } from "ethers";
import { blogTablesAbi, blogTablesContractAddress } from "./constants";
import { BlogDB, BlogSite, BlogSiteDB, MembershipTierDB, userSubscriptionDB } from "./types";

export const getSite = async (signer: ethers.providers.JsonRpcSigner, blogSiteCid: string) => {
    const db = new Database({ signer });
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    const creatorSiteTableName = await contract.CreatorSiteTableName();

    const { results } = await db
        .prepare(`SELECT * FROM ${creatorSiteTableName} WHERE site_cid='${blogSiteCid}'`)
        .all();

    const blogSites = results as BlogSiteDB[];

    return blogSites
        .map((blogSite: BlogSiteDB) => ({
            id: blogSite.id,
            name: blogSite.site_name,
            owner: blogSite.creator_address,
            siteCid: blogSite.site_cid,
        }))
        .find((blogSite: BlogSite) => blogSite.siteCid === blogSiteCid);
};

export const getBlogs = async (signer: ethers.providers.JsonRpcSigner, blogSiteId: number) => {
    const db = new Database({ signer });
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    const creatorBlogTableName = await contract.CreatorBlogTableName();

    const { results: blogs } = await db
        .prepare(`SELECT * FROM ${creatorBlogTableName} WHERE creator_site_id='${blogSiteId}'`)
        .all();

    return blogs.map((blogs: BlogDB) => ({
        id: blogs.id,
        blogCid: blogs.blog_cid,
        blogName: blogs.blog_name,
        creatorAddress: blogs.creator_address,
        creatorSiteId: blogs.creator_site_id,
        creatorMembershipTierId: blogs.creator_membership_tier_id,
    }));
};

export const getMembershipTiers = async (siteId: number) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    if (!signer || !siteId) {
        return [];
    }

    const db = new Database({ signer });
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    const creatorMembershipTiersTableName = await contract.CreatorMembershipTiersTableName();

    const { results: tiers } = await db
        .prepare(
            `SELECT * FROM ${creatorMembershipTiersTableName} WHERE creator_site_id='${siteId}'`
        )
        .all();

    return tiers.map((tier: MembershipTierDB) => ({
        id: tier.id,
        tierName: tier.tier_name,
        tierDescription: tier.tier_description,
        tierMonthlyPrice: tier.tier_monthly_price,
    }));
};

export const getUserSubscriptions = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    if (!signer || !userAddress) {
        return [];
    }

    const db = new Database({ signer });
    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    const userSiteSubscriptionsTableName = await contract.UserSiteSubscriptionsTableName();

    const { results: subs } = await db
        .prepare(
            // `SELECT * FROM ${userSiteSubscriptionsTableName} WHERE user_address='${userAddress}'`
            `SELECT * FROM ${userSiteSubscriptionsTableName}`
        )
        .all();

    return subs.map((sub: userSubscriptionDB) => ({
        id: sub.id,
        creatorMembershipTierId: sub.creator_membership_tier_id,
        subscriptionActivationTimestamp: sub.subscription_activation_timestamp,
    }));
};

export const blogSubscribe = async (params: {
    tierId: number;
    tierPrice: number; // amount in wei
}) => {
    const {
        tierId,
        tierPrice, // amount in wei
    } = params;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    const transactionResponse = await contract.subscribe(userAddress, tierId, {
        value: BigInt(tierPrice),
        gasLimit: 5000000,
    });
    await transactionResponse.wait(1);
};

export const unlockBlogRequest = async (params: { blogCid: string; userAddress: string }) => {
    const res = await fetch("/api/unlockBlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });

    return res.json();
};

// Getting cached subscription info from the contract
export const getSubInfo = async (tierId: number) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(blogTablesContractAddress, blogTablesAbi, signer);
    const info = await contract.getMembershipTierInfor(tierId);
    console.log(info);
};
