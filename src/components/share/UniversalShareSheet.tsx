"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  createNativeSharePayload,
  createShareCopyText,
  createUniversalShareDeepLink,
  createUniversalShareIntent,
  createUniversalSharePreview,
  explainShareRecommendation,
  getSupportedShareModes,
  groupShareDestinations,
  materializeShareIntent,
  queueShare,
  rankShareDestinations,
  searchShareDestinations,
  type CreateShareInput,
  type UniversalShareMode,
  type UniversalShareObject,
} from "@/src/core/share";
import "./universal-share-sheet.css";

export type UniversalShareSheetProps = {
  input: CreateShareInput;
  open: boolean;
  onClose: () => void;
  onShareCreated?: (share: UniversalShareObject) => void;
  recentDestinationIds?: string[];
  favoriteDestinationIds?: string[];
};

export default function UniversalShareSheet({
  input,
  open,
  onClose,
  onShareCreated,
  recentDestinationIds = [],
  favoriteDestinationIds = [],
}: UniversalShareSheetProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "creating" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [createdShare, setCreatedShare] = useState<UniversalShareObject | null>(null);

  const rankedDestinations = useMemo(
    () =>
      rankShareDestinations({
        sourcePortal: input.sourcePortal,
        mood: input.metadata?.mood,
        recentDestinationIds,
        favoriteDestinationIds,
      }),
    [input.sourcePortal, input.metadata?.mood, recentDestinationIds, favoriteDestinationIds],
  );

  const destinations = useMemo(() => searchShareDestinations(rankedDestinations, query), [rankedDestinations, query]);
  const groups = useMemo(() => groupShareDestinations(destinations), [destinations]);

  const [selectedDestinationId, setSelectedDestinationId] = useState(rankedDestinations[0]?.id ?? "lumaspace");

  const selectedDestination =
    destinations.find((destination) => destination.id === selectedDestinationId) ??
    rankedDestinations.find((destination) => destination.id === selectedDestinationId) ??
    destinations[0] ??
    rankedDestinations[0];

  const modes = selectedDestination ? getSupportedShareModes(selectedDestination) : [];
  const [selectedMode, setSelectedMode] = useState<UniversalShareMode>("instant");

  const safeMode = modes.some((mode) => mode.id === selectedMode) ? selectedMode : "instant";
  const preview = selectedDestination ? createUniversalSharePreview(input, selectedDestination, safeMode) : null;
  const recommendation = selectedDestination ? explainShareRecommendation(input, selectedDestination) : "";

  function submitShare() {
    if (!selectedDestination) return;

    setStatus("creating");
    setError("");

    try {
      const intent = createUniversalShareIntent(input, selectedDestination.id, safeMode);
      const share = materializeShareIntent(intent);
      queueShare(share, safeMode === "silent" ? "low" : "normal");

      setCreatedShare(share);
      setStatus("success");
      onShareCreated?.(share);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "share_failed");
    }
  }

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "enter") {
        event.preventDefault();
        submitShare();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, selectedDestination?.id, safeMode]);

  if (!open) return null;

  async function copyLink() {
    if (!createdShare || typeof navigator === "undefined") return;
    const text = createShareCopyText(createdShare, window.location.origin);
    await navigator.clipboard?.writeText(text);
  }

  async function nativeShare() {
    if (!createdShare || typeof navigator === "undefined" || !("share" in navigator)) return;
    const payload = createNativeSharePayload(createdShare, window.location.origin);
    await navigator.share(payload);
  }

  return (
    <div className="usl-sheet-backdrop" role="presentation" data-testid="usl-share-sheet-backdrop">
      <section
        className="usl-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Universal Lumora Share Sheet"
        data-testid="usl-share-sheet"
      >
        <header className="usl-sheet-header">
          <div>
            <p className="usl-eyebrow">Universal Share Layer Ω∞</p>
            <h2>Share with meaning</h2>
          </div>
          <button ref={closeRef} type="button" className="usl-close" aria-label="Close share sheet" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="usl-preview" data-testid="usl-share-preview">
          <span>{input.kind}</span>
          <strong>{preview?.title ?? input.title}</strong>
          <small>{preview?.subtitle ?? input.sourcePortal}</small>
          {preview ? <em>{preview.transformationLabel}</em> : null}
        </div>

        <label className="usl-search-label">
          Search destinations
          <input
            data-testid="usl-share-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="LumaSpace, QR, Live, Zendoro..."
          />
        </label>

        {groups.length === 0 ? (
          <div className="usl-empty" data-testid="usl-share-empty">
            No destinations found.
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.id}>
              <div className="usl-section-title">{group.label}</div>
              <div className="usl-destinations" data-testid="usl-share-destinations">
                {group.destinations.map((destination) => (
                  <button
                    key={destination.id}
                    type="button"
                    className={destination.id === selectedDestinationId ? "usl-destination active" : "usl-destination"}
                    onClick={() => {
                      setSelectedDestinationId(destination.id);
                      const destinationModes = getSupportedShareModes(destination);
                      if (!destinationModes.some((mode) => mode.id === selectedMode)) setSelectedMode("instant");
                    }}
                  >
                    <span className="usl-destination-icon">{destination.icon}</span>
                    <span>
                      <strong>{destination.label}</strong>
                      <small>{destination.description}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}

        <div className="usl-section-title">Mode</div>
        <div className="usl-modes" data-testid="usl-share-modes">
          {modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className={mode.id === safeMode ? "usl-mode active" : "usl-mode"}
              onClick={() => setSelectedMode(mode.id)}
            >
              <strong>{mode.label}</strong>
              <small>{mode.description}</small>
            </button>
          ))}
        </div>

        <div className="usl-recommendation" data-testid="usl-share-recommendation">
          {recommendation}
        </div>

        {status === "success" && createdShare ? (
          <div className="usl-success" data-testid="usl-share-success">
            <strong>Share created</strong>
            <small>{createUniversalShareDeepLink(createdShare, window.location.origin)}</small>
            <div className="usl-mini-actions">
              <button type="button" onClick={copyLink}>Copy link</button>
              <button type="button" onClick={nativeShare}>System share</button>
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="usl-error" data-testid="usl-share-error">
            <strong>Share failed</strong>
            <small>{error}</small>
            <button type="button" onClick={submitShare}>Retry</button>
          </div>
        ) : null}

        <footer className="usl-actions">
          <button type="button" className="usl-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="usl-primary"
            onClick={submitShare}
            data-testid="usl-create-share"
            disabled={status === "creating" || !selectedDestination}
          >
            {status === "creating" ? "Creating..." : `Share to ${selectedDestination?.label ?? "Lumora"}`}
          </button>
        </footer>
      </section>
    </div>
  );
}
