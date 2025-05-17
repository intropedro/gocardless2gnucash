// Utilities to handle the .env file (reading, writing, and refreshing variables)
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

/**
 * Updates or adds variables in the .env file and reloads them into process.env
 */
export function updateEnv(vars: Record<string, string>) {
  const envPath = path.resolve(process.cwd(), '.env');
  const lines = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)
    : [];

  const updated = lines.map(line => {
    const [key] = line.split('=');
    return vars[key] !== undefined ? `${key}=${vars[key]}` : line;
  });

  // Adds new variables if they didn't exist
  for (const [key, val] of Object.entries(vars)) {
    if (!updated.some(l => l.startsWith(key + '='))) {
      updated.push(`${key}=${val}`);
    }
  }

  fs.writeFileSync(envPath, updated.join('\n'));

  // Reload the .env file into process.env
  dotenv.config({ path: envPath });
}