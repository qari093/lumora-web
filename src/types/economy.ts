export type UserId = string;
export type GuildId = string;
export type Currency = "ZC" | "ZCPLUS";
export interface LedgerEntry{ id:string; userId:UserId; currency:Currency; delta:number; memo:string; ts:number; idempotencyKey?:string }
export interface Wallet{ userId:UserId; currency:Currency }
export interface ReferralLink{ code:string; referrerId:UserId; createdAt:number }
export interface ReferralMap{ [inviteeId:string]:{ referrerId:UserId; rate:number } }
export interface Guild{ id:GuildId; name:string; ownerId:UserId; members:Set<UserId>; stakeZc:number; createdAt:number }
