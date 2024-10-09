import { MetadataRoute } from "next";
import { constants } from "@lib/constants";

export default function robots(): MetadataRoute.Robots {
  const robots: MetadataRoute.Robots = {
    rules: {
      userAgent: "*",
    },
    sitemap: `${constants.app.productionUrl}${constants.routes.sitemap}`,
  };

  if (!constants.env.devOrLocal) {
    robots.rules["allow"] = "/";
  } else {
    robots.rules["disallow"] = "/";
  }

  return robots;
}
