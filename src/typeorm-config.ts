import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
	type: "postgres",
	host: process.env.DATABASE_HOST,
	port: Number.parseInt(process.env.DATABASE_PORT) || 5432,
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE_NAME,
	entities: [
		`${__dirname}/**/*.entity{.ts,.js}`
	],
	synchronize: process.env.NODE_ENV !== "production",
	migrations: [`${__dirname}/migration/*{.ts,.js}`],
	cli: {
		migrationsDir: `${__dirname}/migration`
	},
	keepConnectionAlive: true
};

export const seederConfig: TypeOrmModuleOptions = {
	name: "seed",
	type: "postgres",
	host: process.env.DATABASE_HOST,
	port: Number.parseInt(process.env.DATABASE_PORT) || 5432,
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE_NAME,
	synchronize: false,
	migrations: [`${__dirname}/seeds/*{.ts,.js}`],
	cli: {
		migrationsDir: `${__dirname}/seeds`
	}
};

export default [config, seederConfig];
