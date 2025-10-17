import type { ReactNode } from "react";
import { SocketProvider } from "./_components/SocketProvider";

export const metadata = {
  title: "LumaLink",
  description: "Chat + Live calls inside Lumora",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>;
}
