import LumoraPortalPage from "@/components/portal/LumoraPortalPage";

export default function SharePage() {
  return (
    <LumoraPortalPage
      title="Lumora Share"
      eyebrow="Private-first sharing"
      description="Share Lumora moments, portal links, reflections, GMAR activity, CineVerse discoveries, and beta invites with user-controlled visibility."
      actions={[
        { label: "Create Share Link", href: "/api/share/link" },
        { label: "Share Health", href: "/api/share/healthz" },
        { label: "Back to Home", href: "/" }
      ]}
      signals={[
        { label: "Mode", value: "User Controlled" },
        { label: "Privacy", value: "Private First" },
        { label: "Bridge", value: "FYP + LumaSpace" }
      ]}
      modules={[
        "Deep Links",
        "Invite Cards",
        "Moment Sharing",
        "LumaSpace Share",
        "FYP Share",
        "GMAR Share",
        "Privacy Gate",
        "Tracking Guard"
      ]}
    />
  );
}
