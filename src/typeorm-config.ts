import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const extra = process.env.NODE_ENV === "production"
	? { "rejectUnauthorized": false }
	: {};

export const config: TypeOrmModuleOptions = {
	type: "postgres",
	url: process.env.DATABASE_URL,
	entities: [
		`${__dirname}/**/*.entity{.ts,.js}`
	],
	synchronize: process.env.NODE_ENV !== "production",
	migrations: [`${__dirname}/migration/*{.ts,.js}`],
	cli: {
		migrationsDir: `${__dirname}/migration`
	},
	keepConnectionAlive: true,
	...extra
};

export const seederConfig: TypeOrmModuleOptions = {
	name: "seed",
	type: "postgres",
	url: process.env.DATABASE_URL,
	synchronize: false,
	migrations: [`${__dirname}/seeds/*{.ts,.js}`],
	cli: {
		migrationsDir: `${__dirname}/seeds`
	}
};

export default [config, seederConfig];
