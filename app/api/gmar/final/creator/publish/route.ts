import { NextResponse } from "next/server";

import {
  createGmarCreatorProfile,
  createGmarCreatorDraft,
  submitGmarCreatorDraft,
  approveGmarCreatorDraft,
  publishGmarCreatorContent,
  assertGmarCreatorContent
} from "@/src/core/gmar/final-completion/creator/creatorPublishing";

export async function POST() {
  try {
    const creator = createGmarCreatorProfile({
      creatorId: "creator_origin",
      playerId: "gmar_user_001",
      displayName: "Origin Creator"
    });

    const draft = createGmarCreatorDraft({
      contentId: "origin_clip_001",
      creator,
      title: "Origin Storm Victory",
      description: "Final battle clip from Origin Storm."
    });

    const submitted = submitGmarCreatorDraft(draft);
    const approved = approveGmarCreatorDraft(submitted);

    const published = publishGmarCreatorContent({
      content: approved
    });

    assertGmarCreatorContent(published);

    return NextResponse.json({
      ok: true,
      creator,
      content: published
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR creator publishing failed."
      },
      { status: 400 }
    );
  }
}
