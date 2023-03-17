import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("transactions", table =>{
		table.string("id").primary();
		table.string("title").notNullable();
		table.decimal("amount").notNullable();
	});
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("transactions");
}

