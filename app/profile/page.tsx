import ProfileLiveClient from "@/components/profile/ProfileLiveClient";

export default function ProfilePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Profile</h1>
      <ProfileLiveClient />
    </main>
  );
}
