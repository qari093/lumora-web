export type SafetyTier="clean"|"fashion"|"spicy-safe";
export interface BitesPlanRequest{selfieMeta?:any;scenario?:any;creative?:any;safetyTier?:SafetyTier;allowSensitive?:boolean;}
export interface BitesPlanResponse{ok:boolean;meta:any;creative:any;audio:any;video:any;optimization:any;policy:any;}
