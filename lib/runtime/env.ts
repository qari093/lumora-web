export const runtimeEnv = {
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_ENV: process.env.APP_ENV || "local",
  IS_DEV: process.env.NODE_ENV !== "production",
  IS_PROD: process.env.NODE_ENV === "production"
};

export default runtimeEnv;
