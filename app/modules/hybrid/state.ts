type Item={id:string};
const BALANCES=new Map<string,number>();
export function getBalance(user:string){return BALANCES.get(user)||0;}
export function addCredits(user:string,amt:number){const v=getBalance(user)+amt;BALANCES.set(user,v);return v;}
export function snapshot(){return Array.from(BALANCES.entries()).map(([user,credits])=>({user,credits}));}
export function reset(){BALANCES.clear();return true;}
