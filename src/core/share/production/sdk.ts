export function createSdkReleaseManifest(version: string) {
  return {
    id: `usl_sdk_${version}`,
    version,
    packages: ["@lumora/usl-core", "@lumora/usl-react", "@lumora/usl-connectivity"],
    exports: ["createShare", "openShareSheet", "transformShare", "deliverShare", "revokeShare"],
    semverCompatible: true,
  };
}

export function createDeveloperDocumentationMap() {
  return {
    quickstart: "/docs/usl/quickstart",
    api: "/docs/usl/api",
    webhooks: "/docs/usl/webhooks",
    extensions: "/docs/usl/extensions",
    migration: "/docs/usl/migration",
  };
}
