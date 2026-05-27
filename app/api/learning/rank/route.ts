import { applyClusterBoost } from "@/src/lib/learning/clusterBoost";
import { detectUserCluster } from "@/src/lib/learning/userCluster";
import { buildContextProfile } from "@/src/lib/learning/contextProfile";
import { applyContextAdjust } from "@/src/lib/learning/contextAdjust";
import { applyExploration } from "@/src/lib/learning/exploration";
import { diversityVsRelevance } from "@/src/lib/learning/diversityControl";
import { balanceSources } from "@/src/lib/learning/sourceBalance";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { applyLearningScore } from "@/src/lib/learning/score";

export async function GET() {
  try {
    const profileFile = path.join(process.cwd(),"data/user_profiles/user_A.json");
    const interests = fs.existsSync(profileFile)
      ? JSON.parse(fs.readFileSync(profileFile,"utf-8")).interests || {}
      : {};

    const items = [
      { id:"a", topic:"watch", final_score:1 },
      { id:"b", topic:"skip", final_score:1 },
      { id:"c", topic:"youtube", final_score:1 }
    ];

    /* CLUSTER LOGIC */
const cluster = detectUserCluster({ interests });
let ranked = applyLearningScore(items, interests);
ranked = applyClusterBoost(ranked, cluster);
  ranked = balanceSources(ranked);
  ranked = diversityVsRelevance(ranked,1);
  ranked = applyExploration(ranked,true);
    const ctx = buildContextProfile({ hour: 20, device: "web", mood: "neutral" });
    ranked = applyContextAdjust(ranked, ctx);

    return NextResponse.json({ ok:true, data:{ ranked } });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e?.message || "rank_failed" }, { status:500 });
  }
}
