import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = path.dirname(fileURLToPath(import.meta.url));

loadEnv({ path: path.resolve(configDirectory, "../../.env"), quiet: true });
