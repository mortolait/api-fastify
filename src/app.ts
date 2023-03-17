import fastify from "fastify";
import  knex  from "./database";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";

export const app = fastify();

app.get("/", async (request, reply) => {
	const tables = await knex("sqlite_schema").select("*");
	return tables;
});

app.register(cookie);
app.register(transactionsRoutes,{
	prefix: "transactions"
});
