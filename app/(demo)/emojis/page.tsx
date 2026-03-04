import EmojisClient from "./EmojisClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function EmojisPage() {
  return <EmojisClient />;
}
