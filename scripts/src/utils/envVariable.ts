import { config } from "https://deno.land/x/dotenv/mod.ts";

const denoEnv = config({ safe: true });

export function getEnvVariable(key: string): string {
  const envVariable = denoEnv[key];
  if (!envVariable) {
    throw new Error(`Cannot find ${key} env variable`);
  }
  return envVariable;
}
