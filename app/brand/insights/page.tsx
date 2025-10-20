import { prisma } from "@/lib/prisma";
import { getLangFromRequest, t, money } from "@/lib/i18n/index";

export default async function BrandInsightsPage() {
  const lang = await getLangFromRequest();
  const title = await t(lang, "insights", "title");
  const rows = await prisma.adEvent.groupBy({
    by: ["action"],
    _count: { _all: true }
  } as any);
  const byAction: Record<string, number> = {};
  for (const r of rows) byAction[r.action] = Number((r as any)._count?._all || 0);

  const spend = await prisma.cpvView.aggregate({ _sum: { costCents: true } }) as any;
  const rewards = await prisma.adConversion.aggregate({ _sum: { rewardCents: true } }) as any;

  return (
    <div style={{maxWidth:1000, margin:"24px auto", padding:"0 16px", fontFamily:"ui-sans-serif, system-ui"}}>
      <h1 style={{fontSize:26, fontWeight:700}}>{title}</h1>
      <div style={{display:"grid", gridTemplateColumns:"repeat(4, minmax(0,1fr))", gap:12}}>
        <K v={byAction.view||0} label={(await t(lang,"common","views"))} />
        <K v={byAction.hover||0} label={(await t(lang,"common","hovers"))} />
        <K v={byAction.click||0} label={(await t(lang,"common","clicks"))} />
        <K v={Number(rewards._sum?.rewardCents||0)} label={(await t(lang,"common","rewards"))} moneyFmt />
      </div>
      <p style={{color:"#666", marginTop:10}}>{await t(lang,"insights","kpi","{name} in last {mins} minutes".includes("name")?{ name: "KPIs", mins: 60}:{})}</p>
    </div>
  );
}
function K({ v, label, moneyFmt=false }: { v:number, label:string, moneyFmt?:boolean }) {
  return (
    <div style={{border:"1px solid #eee", borderRadius:10, padding:"12px"}}>
      <div style={{fontSize:12, color:"#666"}}>{label}</div>
      <div style={{fontSize:20, fontWeight:700}}>{moneyFmt ? "€"+(v/100).toFixed(2) : v}</div>
    </div>
  );
}
