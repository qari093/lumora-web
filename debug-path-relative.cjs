const path = require("path");
const orig = path.relative;
path.relative = function(from, to, ...rest) {
  if (typeof to !== "string") {
    console.error("🛑 path.relative called with bad args:");
    console.error("   from =", from);
    console.error("   to   =", to);
    console.error("   rest =", rest);
    console.error(new Error("Stack trace for path.relative misuse").stack);
  }
  return orig.apply(this, [from, to, ...rest]);
};
