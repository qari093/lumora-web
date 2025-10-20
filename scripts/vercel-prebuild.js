console.log("Node:", process.version);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "MISSING");
console.log("PRISMA_CLIENT_DIR exists:", !!require.resolve?.("@prisma/client").length);
process.exit(0);
