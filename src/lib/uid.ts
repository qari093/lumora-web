import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE = "lumora_uid";
export function getOrSetUid() {
  const jar = cookies();
  let uid = jar.get(COOKIE)?.value;
  if(!uid){
    uid = randomUUID();
    jar.set({
      name: COOKIE, value: uid, path: "/", sameSite: "lax",
      httpOnly: true, // secure from JS
      secure: process.env.NODE_ENV === "production",
      maxAge: 60*60*24*365
    });
  }
  return uid;
}
