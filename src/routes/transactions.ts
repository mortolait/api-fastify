import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { request } from "http";
import { knex } from "../database";
import { z } from "zod";
import { checkSessionIdExists } from "../middleware/check-session-exist";

export async function transactionsRoutes(app: FastifyInstance) {
	app.addHook("preHandler", async (request, reply) => {
		console.log("request.cookies");
	});
	app.get("/", {
		preHandler: [checkSessionIdExists]
	}, async (request, reply) => {

		const { sessionId } = request.cookies;

		const transactions = await knex("transactions")
			.where("session_id", sessionId)
			.select();

		return { transactions };
	});

	app.get("/:id", async (request) => {
		const getTransactionsParamsSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = getTransactionsParamsSchema.parse(request.params);
		const { sessionId } = request.cookies;
		const transaction = await knex("transactions")
			.where({
				"id": id,
				"session_id": sessionId
			}).first();

		return {
			transaction
		};
	});

	app.post("/", async (request, reply) => {
		const createTransactionsParamsSchema = z.object({
			title: z.string(),
			amount: z.number(),
			type: z.enum(["credit", "debit"])
		});

		const { title, amount, type } = createTransactionsParamsSchema.parse(
			request.body
		);

		let sessionId = request.cookies.sessionId;

		if (!sessionId) {
			sessionId = randomUUID();
		}
		reply.cookie("sessionId", sessionId, {
			// barra para todas as rotas
			path: "/",
			maxAge: 1000 * 60 * 60 * 24 * 7
		});
		await knex("transactions").insert({
			id: randomUUID(),
			title,
			amount: type === "credit" ? amount : amount * -1,
			session_Id: sessionId
		});

		return reply.status(201).send();
	});
}