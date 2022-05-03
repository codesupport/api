import { MigrationInterface, QueryRunner } from "typeorm";

export class user1651573299484 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("insert into \"user\"(id, auth_id, username) VALUES (1, 'auth_id:test', 'testuser')");
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("delete from \"user\" where id = 1");
	}
}
