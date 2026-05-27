import { duplicateRouteAudit } from "../audit/duplicateRouteAudit";

export function routeConflictValidator(routes: string[]) {
  return duplicateRouteAudit(routes).clean;
}
