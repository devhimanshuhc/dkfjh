import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Migrations run from packages/db but DATABASE_URL lives in the server env
config({ path: "../../apps/server/.env" });

export default defineConfig({
	datasource: {
		url: process.env.DATABASE_URL,
	},
});
