import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.lumoraverse.founder",
  appName: "Lumora",
  webDir: "native-shell",
  server: {
    url: "https://lumoraverse.io",
    cleartext: false,
    allowNavigation: [
      "lumoraverse.io",
      "*.lumoraverse.io",
    ],
  },
  ios: {
    contentInset: "automatic",
  },
};

export default config;
