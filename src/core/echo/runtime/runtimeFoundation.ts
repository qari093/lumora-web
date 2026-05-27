export const echoRuntimeFoundation = {
  status: "active",
  runtime: "echo-core",
  deployment: "lean"
};

export function runtimeReady() {
  return echoRuntimeFoundation.status === "active";
}
