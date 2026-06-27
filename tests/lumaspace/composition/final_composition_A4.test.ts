import { describe,it,expect } from "vitest";
import {
  validateFinalComposition,
  FinalComposition
} from "@/src/core/lumaspace/composition/finalComposition";

describe("LumaSpace Ω∞ Final Composition",()=>{

  it("locks hierarchy",()=>{
    expect(validateFinalComposition()).toBe(true);
    expect(FinalComposition.hierarchy).toContain("YOU");
  });

  it("locks serenity rule",()=>{
    expect(FinalComposition.serenityRule).toEqual({
      serenity:70,
      wonder:20,
      spectacle:10
    });
  });

});
