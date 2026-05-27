import { UserState } from "@/src/monetization/config/stateModel";
import { AdType } from "./eligibility";

export function mapStateToAdTypes(state: UserState): AdType[] {
  switch (state) {
    case "green":
      return ["native_feed", "exit_interaction", "reward"];
    case "yellow":
      return ["native_feed"];
    case "red":
      return [];
  }
}
