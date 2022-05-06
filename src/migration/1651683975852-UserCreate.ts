import { MigrationInterface, QueryRunner } from "typeorm";

export class UserCreate1651683975852 implements MigrationInterface {
	name = "UserCreate1651683975852";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("CREATE TABLE \"user\" (\"id\" SERIAL NOT NULL, \"auth_id\" character varying NOT NULL, \"username\" character varying NOT NULL, \"created\" TIMESTAMP NOT NULL DEFAULT now(), \"modified\" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT \"UQ_56d00ec31dc3eed1c3f6bff4f58\" UNIQUE (\"auth_id\"), CONSTRAINT \"UQ_78a916df40e02a9deb1c4b75edb\" UNIQUE (\"username\"), CONSTRAINT \"PK_cace4a159ff9f2512dd42373760\" PRIMARY KEY (\"id\"))");
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("DROP TABLE \"user\"");
	}
}
