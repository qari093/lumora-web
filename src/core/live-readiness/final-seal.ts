import { validateDatabasePersistenceReadiness } from "./db/runtime";
import { validateProviderReadiness } from "./providers/runtime";
import { validateAuthReadiness } from "./auth/runtime";
import { validateUiDataReadiness } from "./ui/runtime";
import { validateBetaReadiness } from "./beta/runtime";
import { validateBugFixReadiness } from "./bugs/runtime";
import { validateDeploymentReadiness } from "./deployment/runtime";

export const creatorShareFinalLiveReadinessPhases = {
  databasePersistence: validateDatabasePersistenceReadiness(),
  providers: validateProviderReadiness(),
  auth: validateAuthReadiness(),
  uiDataFetching: validateUiDataReadiness(),
  betaTesting: validateBetaReadiness(),
  bugFixLoop: validateBugFixReadiness(),
  deploymentValidation: validateDeploymentReadiness(),
};

export function canApplyCreatorShareLiveReadySeal() {
  return Object.values(creatorShareFinalLiveReadinessPhases).every(Boolean);
}
