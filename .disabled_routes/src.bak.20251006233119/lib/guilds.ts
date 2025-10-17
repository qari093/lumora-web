import { Guild, GuildId, UserId } from "@/types/economy";
import { debit, credit } from "@/lib/ledger";
const guilds=new Map<GuildId,Guild>();
let gid=1;
export function createGuild(ownerId:UserId,name:string,stakeZc:number):Guild{
  if(stakeZc<10) throw new Error("min 10 ZC stake");
  const id=String(gid++); debit(ownerId,"ZC",stakeZc,"create guild stake");
  const g:Guild={ id,name,ownerId,members:new Set([ownerId]),stakeZc,createdAt:Date.now()};
  guilds.set(id,g); return g;
}
export function joinGuild(userId:UserId,guildId:GuildId, stakeZc:number){
  const g=guilds.get(guildId); if(!g) throw new Error("guild not found");
  if(stakeZc<5) throw new Error("min 5 ZC stake");
  debit(userId,"ZC",stakeZc,"join guild stake");
  g.members.add(userId); g.stakeZc+=stakeZc; return g;
}
export function rewardGuild(guildId:GuildId, totalRewardZc:number){
  const g=guilds.get(guildId); if(!g) throw new Error("guild not found");
  const members=[...g.members]; if(members.length===0) return 0;
  const each=Math.floor(totalRewardZc/members.length);
  members.forEach(m=> credit(m,"ZC",each,`guild reward ${guildId}`));
  return each;
}
export function getGuild(guildId:GuildId){ return guilds.get(guildId)||null; }
