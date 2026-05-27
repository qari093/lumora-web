export function calculateBid(input: {
  bid: number;
  relevance: number;
  state: "green" | "yellow" | "red";
}) {
  if (input.state === "red") return 0;
  return input.bid * input.relevance;
}
