import { MetadataRoute } from "next";
import { constants } from "@lib/constants";

const lastModified = new Date();
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${constants.app.productionUrl}`,
      lastModified: lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
