const name = "Timekeepers";
const caption = "Tomorrow, Today!";
// Environment
const environment = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || "development";
const localEnv = environment === "local";
const prodEnv = ["production", "prod"].includes(environment);
const devEnv = !localEnv && !prodEnv;
const devOrLocalEnv = devEnv || localEnv;
// Core Web App (CWA)
const cwaServerHost = process.env.CWA_SERVER_HOST || "http://localhost";
const cwaServerPort = process.env.CWA_SERVER_PORT || 3000;
const cwaServerUrl = process.env.NEXT_PUBLIC_CWA_SERVER_URL || `${cwaServerHost}:${cwaServerPort}`;

export const constants = Object.freeze({
  // Environment
  env: {
    dev: devEnv,
    local: localEnv,
    devOrLocal: devOrLocalEnv,
    prod: prodEnv,
  },
  // CWA
  cwa: {
    host: cwaServerHost,
    port: cwaServerPort,
    url: cwaServerUrl,
  },
  app: {
    id: "cx-time-app",
    name: name,
    caption: caption,
    productionUrl: "https://connextar.com",
    repoUrl: "https://github.com/Connextar/cx-website",
  },
  // Routes
  routes: {
    anchor: "#",
    home: "/",
    sitemap: "/sitemap.xml",
    api: {
      base: cwaServerUrl + (cwaServerUrl?.charAt(cwaServerUrl?.length - 1) !== "/" ? "/" : "") + "api/",
      data: "data",
      nft: "nft",
    },
  },
  social: {
    linkedIn: "https://www.linkedin.com/company/connextar-technologies-ltd",
    facebook: "https://www.facebook.com/p/Connextar-Technologies-Ltd-100069706274678",
    twitter: "https://x.com/connextar",
  },
  integrations: {
    // WalletConnect
    wc: {
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "",
    },
    // Zora Network
    zora: {
      useTestNet: process.env.NEXT_PUBLIC_USE_ZORA_TESTNET === "true",
    },
  },
});
