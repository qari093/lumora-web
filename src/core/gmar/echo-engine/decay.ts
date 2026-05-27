export type EchoLuminosity = {
  echoId: string;
  luminosity: number;
  dormant: boolean;
};

export function calculateEchoLuminosity(
  echoId: string,
  weeksOld: number,
  revived = false,
): EchoLuminosity {
  const luminosity = revived ? 1 : Math.max(0.1, 1 - weeksOld * 0.05);

  return {
    echoId,
    luminosity,
    dormant: luminosity <= 0.25,
  };
}
