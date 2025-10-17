const keyHex = process.env.EMOTION_DATA_KEY || "";
function hexToBytes(hex:string){ const a=[] as number[]; for(let i=0;i<hex.length;i+=2){ a.push(parseInt(hex.slice(i,i+2),16)); } return new Uint8Array(a); }
async function getKey(){
  if(!keyHex || keyHex.length<64) throw new Error("EMOTION_DATA_KEY missing/short");
  return await crypto.subtle.importKey("raw", hexToBytes(keyHex), "AES-GCM", false, ["encrypt","decrypt"]);
}
export async function encryptJSON(obj:any){
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey();
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const ct = new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM", iv}, key, data));
  return { iv: Buffer.from(iv).toString("base64"), ct: Buffer.from(ct).toString("base64") };
}
export async function decryptJSON(payload:{iv:string, ct:string}){
  const key = await getKey();
  const iv = Uint8Array.from(Buffer.from(payload.iv,"base64"));
  const ct = Uint8Array.from(Buffer.from(payload.ct,"base64"));
  const pt = await crypto.subtle.decrypt({name:"AES-GCM", iv}, key, ct);
  return JSON.parse(new TextDecoder().decode(new Uint8Array(pt)));
}
