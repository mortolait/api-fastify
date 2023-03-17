import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import request from "supertest";
import { app } from "../app";

describe("Transactions routes", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		execSync("yarn knex migrate:rollback");
		execSync("yarn knex migrate:latest");
	});

	it("should be able to create a new transaction", async () => {
		await request(app.server)
			.post("/transactions")
			.send({
				title: "Salario",
				amount: 1000,
				type: "credit"
			});
	});

	it("should be able to list all transactions", async () => {
		const createTransactionResponse = await request(app.server)
			.post("/transactions")
			.send({
				title: "New transaction",
				amount: 5000,
				type: "credit",
			});

		const cookies = createTransactionResponse.get("Set-Cookie");

		const listTransactionsResponse = await request(app.server)
			.get("/transactions")
			.set("Cookie", cookies)
			.expect(200);

		expect(listTransactionsResponse.body.transactions).toEqual([
			expect.objectContaining({
				title: "New transaction",
				amount: 5000,
			}),
		]);
	});
});