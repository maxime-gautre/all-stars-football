import * as dotenv from 'dotenv'

dotenv.config()

export function getEnvVariable(key: string): string {
  const envVariable = process.env[key]
  if (!envVariable) {
    throw new Error(`Cannot find ${key} env variable`)
  }
  return envVariable
}
