import Head from "next/head";
import Link from "next/link";

export default function Videos() {
  return (
    <>
      <Head><title>Lumora — Videos</title></Head>
      <main style={{padding:"24px",color:"#fff",background:"#0f0f10",minHeight:"100vh"}}>
        <h1 style={{fontSize:28,marginBottom:12}}>Videos</h1>
        <p style={{opacity:.8,marginBottom:16}}>
          Welcome to Lumora videos. This page is served via the Pages Router for maximum Vercel compatibility.
        </p>
        <ul style={{lineHeight:"2"}}>
          <li><a href="/public/videos/test-1.mp4">Sample clip</a> (direct)</li>
          <li><Link href="/">Home</Link></li>
        </ul>
      </main>
    </>
  );
}
