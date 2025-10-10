import Link from "next/link";
export default function Page(){
  return (<div style={{padding:24}}>
    <h1>Dash</h1>
    <ul style={{lineHeight:1.9}}>
      <li><Link href="/dash/admin">/dash/admin</Link></li>
      <li><Link href="/dash/moderator">/dash/moderator</Link></li>
      <li><Link href="/dash/creator">/dash/creator</Link></li>
      <li><Link href="/dash/advertiser">/dash/advertiser</Link></li>
      <li><Link href="/dash/user">/dash/user</Link></li>
    </ul>
  </div>);
}
