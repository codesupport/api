import { MigrationInterface, QueryRunner } from "typeorm";

export class User1651573299484 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("insert into \"user\"(id, auth_id, username, created, modified) VALUES (1, 'auth_id:test', 'testuser', '2022-05-04 17:00:30.000000', '2022-05-04 17:10:00.000000')");
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("delete from \"user\" where id = 1");
	}
}
