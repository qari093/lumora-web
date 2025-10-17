import React from "react";
import BottomDock from "../../components/BottomDock";

export const metadata = { title: "Gmar · Games", description: "Playground of 15 games with holographic ads" };

export default function GmarLayout({ children }:{ children: React.ReactNode }){
  return (
    <section>
      {children}
      <BottomDock/>
    </section>
  );
}
