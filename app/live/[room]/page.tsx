"use client";
import LumoraVideoPro from "../../../components/LumoraVideoPro";

export default function LivePage({ params }: { params: { room: string } }) {
  return <LumoraVideoPro room={params?.room ?? "main-room"} />;
}
