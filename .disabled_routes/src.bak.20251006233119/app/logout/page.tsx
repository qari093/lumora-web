"use client";
import React from "react";
import { signOut } from "next-auth/react";
export default function LogoutPage(){
  React.useEffect(()=>{ signOut({ callbackUrl: "/login" }); },[]);
  return <div style={{ padding:20 }}>Signing out…</div>;
}
