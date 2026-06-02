export function gravityAccuracyValidation(success:number,total:number){
  const accuracy = total === 0 ? 0 : success / total;
  return {
    accuracy,
    locked: accuracy >= 0.95
  };
}

export function gravityDiscoverabilityValidation(rate:number){
  return {
    passed: rate >= 0.6,
    rate
  };
}

export function gravityFrustrationValidation(rate:number){
  return {
    passed: rate <= 0.1,
    rate
  };
}
