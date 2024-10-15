import { constants } from "@lib/index";

/**
 * Get the formatted app URL for the given endpoint, replacing any placeholders with the respective parameters.
 * @param {string} endpoint
 * @param {null|undefined|{[]}} params
 * @returns {string}
 */
export const getUrl = (endpoint: string, params?: { [key: string]: never }): string => {
  return formatUrl(constants.cwa.url, endpoint, params);
};

/**
 * Get the formatted API URL for the given endpoint, replacing any placeholders with the respective parameters.
 * @param {string} endpoint
 * @param {null|undefined|{[]}} params
 * @returns {string}
 */
export const getApiUrl = (endpoint: string, params?: { [key: string]: never }): string => {
  return formatUrl(constants.routes.api.base, endpoint, params);
};

export const formatUrl = (
  base: string = constants.routes.api.base,
  endpoint: string,
  params?: {
    [key: string]: never;
  },
) => {
  let apiUrl = base;
  // Append forward slash to the base URL if it doesn't already have one.
  apiUrl += apiUrl?.charAt(apiUrl?.length - 1) !== "/" && endpoint?.charAt(0) !== "/" ? "/" : "";
  // Remove forward slash from the base URL if it's already provided in the endpoint.
  apiUrl = endpoint?.charAt(0) === "/" ? apiUrl.slice(0, apiUrl?.length - 1) : apiUrl;
  apiUrl += endpoint;
  // console.log("getApiUrl -> apiUrl", apiUrl);

  const placeholderIdToken = "/:";
  const urlPlaceholders: string[] = apiUrl.split(placeholderIdToken);
  const usedParamKeys: string[] = [];

  if (urlPlaceholders.length >= 2) {
    urlPlaceholders.shift();

    urlPlaceholders.forEach((placeholder) => {
      const placeholderKey = placeholder.split("/")[0];

      if (placeholderKey) {
        usedParamKeys.push(placeholderKey);
        const paramValue = params?.[placeholderKey];
        apiUrl = apiUrl.replace(placeholderIdToken + placeholderKey, "/" + paramValue);
      }
    });
  }

  if (params) {
    const remainingParamKeys = Object.keys(params).filter((paramKey) => !usedParamKeys.includes(paramKey));

    remainingParamKeys?.forEach((paramKey, index) => {
      const paramValue = params?.[paramKey];
      apiUrl += index === 0 ? "?" : "&";
      apiUrl += `${paramKey}=${paramValue}`;
    });
  }

  return apiUrl;
};
