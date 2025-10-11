import dynamic from "next/dynamic";
const Page = dynamic(() => import("../../app/render/live/page").then(m => m.default), { ssr: false });
export default Page;
