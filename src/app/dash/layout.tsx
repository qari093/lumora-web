import React from "react";
import RoleBar from "@/components/RoleBar";

export default function DashLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body style={{margin:0, background:"#0b0f12", color:"#e5e7eb", fontFamily:"ui-sans-serif,system-ui"}}>
        <RoleBar />
        <div style={{padding:16}}>{children}</div>
      </body>
    </html>
  );
}
