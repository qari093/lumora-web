import ClientLayout from "@/components/ClientLayout";
import PrimaryNav from "@/components/nav/PrimaryNav";
import ServiceWorkerRegister from "components/pwa/ServiceWorkerRegister";
import SplashGate from "@/components/splash/SplashGate";
import BootMark from "@/components/splash/BootMark";

export const runtime = "nodejs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <PrimaryNav />
        <ServiceWorkerRegister />
        
        <SplashGate durationMs={1400} fadeOutMs={220} />
        <BootMark />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}