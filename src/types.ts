export interface BlogSiteDB {
    id: number;
    site_name: string;
    creator_address: string;
    site_cid: string;
}

export interface BlogSite {
    id: number;
    name: string;
    owner: string;
    siteCid: string;
}

export interface BlogDB {
    id: number;
    blog_cid: string;
    blog_name: string;
    creator_address: string;
    creator_site_id: string;
    creator_membership_tier_id: number | null;
}

export interface Blog {
    id: number;
    blogCid: string;
    blogName: string;
    creatorAddress: string;
    creatorSiteId: string;
    creatorMembershipTierId: number | null;
}

export interface MembershipTierDB {
    id: number;
    tier_name: string;
    tier_monthly_price: number;
    tier_description: string;
}

export interface userSubscriptionDB {
    id: number;
    creator_membership_tier_id: number;
    subscription_activation_timestamp: number;
}

export interface UserSubscription {
    id: number;
    creatorMembershipTierId: number;
    subscriptionActivationTimestamp: number;
}
