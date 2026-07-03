"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CreateShareInput, UniversalShareObject } from "@/src/core/share";
import UniversalShareSheet from "./UniversalShareSheet";

type ShareRequest = {
  input: CreateShareInput;
  recentDestinationIds?: string[];
  favoriteDestinationIds?: string[];
};

type UniversalShareContextValue = {
  openShare: (request: ShareRequest) => void;
  closeShare: () => void;
  lastShare: UniversalShareObject | null;
};

const UniversalShareContext = createContext<UniversalShareContextValue | null>(null);

export function UniversalShareProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ShareRequest | null>(null);
  const [lastShare, setLastShare] = useState<UniversalShareObject | null>(null);

  const closeShare = useCallback(() => setRequest(null), []);
  const openShare = useCallback((nextRequest: ShareRequest) => setRequest(nextRequest), []);

  const value = useMemo(
    () => ({
      openShare,
      closeShare,
      lastShare,
    }),
    [openShare, closeShare, lastShare],
  );

  return (
    <UniversalShareContext.Provider value={value}>
      {children}
      {request ? (
        <UniversalShareSheet
          open={Boolean(request)}
          onClose={closeShare}
          input={request.input}
          recentDestinationIds={request.recentDestinationIds}
          favoriteDestinationIds={request.favoriteDestinationIds}
          onShareCreated={(share) => {
            setLastShare(share);
            window.dispatchEvent(new CustomEvent("lumora:share-created", { detail: share }));
          }}
        />
      ) : null}
    </UniversalShareContext.Provider>
  );
}

export function useUniversalShare() {
  const context = useContext(UniversalShareContext);
  if (!context) {
    throw new Error("useUniversalShare_must_be_used_inside_UniversalShareProvider");
  }
  return context;
}
