export type TowerIssue = {
  id: string;
  severity: "low"|"medium"|"high"|"critical";
  area: "build"|"lint"|"type"|"deps"|"bundle"|"game";
  message: string;
  meta?: Record<string,unknown>;
};
export class CCTower {
  private issues: TowerIssue[] = [];
  log(i: TowerIssue){ this.issues.push(i); }
  getAll(){ return this.issues.slice(); }
  hasBlocking(){ return this.issues.some(i=>i.severity==="critical"||i.severity==="high"); }
}
