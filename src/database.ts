import { knex as setupKnex, Knex } from "knex";
import { env } from "./env";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not defined");
}

export const config: Knex.Config = {
	client: env.DATABASE_CLIENT,
	connection: env.DATABASE_CLIENT == "sqlite" ? {
		filename: process.env.DATABASE_URL
	} : process.env.DATABASE_URL,
	useNullAsDefault: true,
	migrations: {
		directory: "./src/migrations"
	}

};

export const knex = setupKnex(config);

export default knex;
