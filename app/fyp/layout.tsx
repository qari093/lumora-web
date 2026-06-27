import FypShellCleaner from "./FypShellCleaner";

export default function FypLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html.lumora-fyp-isolated,
            body.lumora-fyp-isolated {
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
              background: #000 !important;
              width: 100vw !important;
              height: 100svh !important;
            }

            body.lumora-fyp-isolated nav[aria-label="Global portal navigation"],
            body.lumora-fyp-isolated nav[aria-label="Lumora portal arc"],
            body.lumora-fyp-isolated button[data-testid="lumora-home-beacon"],
            body.lumora-fyp-isolated div[data-testid="home-beacon-dashboard"],
            body.lumora-fyp-isolated [data-home-beacon-state],
            body.lumora-fyp-isolated [data-home-beacon-portal],
            body.lumora-fyp-isolated [data-testid="home-beacon-portal-arc"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }

            body.lumora-fyp-isolated > * {
              max-width: none !important;
            }

            video::-webkit-media-controls,
            video::-webkit-media-controls-panel,
            video::-webkit-media-controls-play-button,
            video::-webkit-media-controls-start-playback-button {
              display: none !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
          `
        }}
      />
      <FypShellCleaner />
      {children}
    </>
  );
}
