import KycClient from "./KycClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function KycPage() {
  return <KycClient />;
}
