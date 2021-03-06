import { axiod } from "../../../../../deps.ts";
import { getEnvVariable } from "../../../../../shared/envVariable.ts";
import { ApiError, FootballApiResponse, RateLimitError } from "./types.ts";

const ApiSportsKey = getEnvVariable("APISPORTS_KEY");

export async function fetchData<T>(
  path: string,
  params: { [key: string]: string | number | boolean },
): Promise<FootballApiResponse<T>> {
  const config = {
    url: `https://v3.football.api-sports.io/${path}`,
    method: "get" as const,
    headers: {
      "x-apisports-key": ApiSportsKey,
    },
    params,
  };
  const res = await axiod.request(config);
  const data = (res.data as unknown) as FootballApiResponse<T>;
  const errors = data.errors;

  if (isStringArray(errors)) {
    if (errors.length > 0) {
      throw new Error(`Error when fetching data: ${errors.join(", ")}`);
    }
  } else {
    if (errors) {
      if (errors["rateLimit"]) {
        throw new RateLimitError(errors["rateLimit"]);
      } else if (errors["requests"]) {
        throw new RateLimitError(errors["requests"]);
      } else {
        const msg = Object.keys(errors).reduce((acc, key) => {
          return `${acc}- ${key}: ${errors[key]}\n`;
        }, "");
        throw new Error(`Error when fetching data: ${msg}`);
      }
    }
  }
  return data;
}

function isStringArray(value: ApiError): value is string[] {
  if (value instanceof Array) {
    return true;
  }
  return false;
}
