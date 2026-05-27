export function detectAbuse(input: { duplicateSignals: number; maxDuplicates?: number }) {
  const maxDuplicates = input.maxDuplicates ?? 1;
  return {
    abusive: input.duplicateSignals > maxDuplicates,
    reason: input.duplicateSignals > maxDuplicates ? "duplicate_signal_abuse" : "clean",
  };
}

export function validateSignalIntegrity(input: { humanOnly: boolean; inferredEmotion?: boolean }) {
  return {
    ok: input.humanOnly === true && input.inferredEmotion !== true,
  };
}

export function detectAnomaly(input: { ratePerMinute: number; maxRate?: number }) {
  const maxRate = input.maxRate ?? 30;
  return {
    anomalous: input.ratePerMinute > maxRate,
  };
}

export function preventManipulation(input: {
  abusive: boolean;
  anomalous: boolean;
  signalIntegrityOk: boolean;
}) {
  return {
    allowed: !input.abusive && !input.anomalous && input.signalIntegrityOk,
  };
}

export function validateTrustSystem(input: {
  abuse?: { abusive: boolean };
  anomaly?: { anomalous: boolean };
  manipulation?: { allowed: boolean };
}) {
  return {
    ok:
      input.abuse?.abusive === false &&
      input.anomaly?.anomalous === false &&
      input.manipulation?.allowed === true,
  };
}
