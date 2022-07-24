import { MigrationInterface, QueryRunner } from "typeorm";

export class APISetup1658614084162 implements MigrationInterface {
	name = "APISetup1658614084162";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("CREATE TABLE \"user\" (\"id\" SERIAL NOT NULL, \"auth_id\" character varying NOT NULL, \"username\" character varying NOT NULL, \"created\" TIMESTAMP NOT NULL DEFAULT now(), \"modified\" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT \"UQ_56d00ec31dc3eed1c3f6bff4f58\" UNIQUE (\"auth_id\"), CONSTRAINT \"UQ_78a916df40e02a9deb1c4b75edb\" UNIQUE (\"username\"), CONSTRAINT \"PK_cace4a159ff9f2512dd42373760\" PRIMARY KEY (\"id\"))");
		await queryRunner.query("CREATE TYPE \"public\".\"article_status_enum\" AS ENUM('PENDING', 'APPROVED', 'REJECTED')");
		await queryRunner.query("CREATE TABLE \"article\" (\"id\" SERIAL NOT NULL, \"created\" TIMESTAMP NOT NULL DEFAULT now(), \"modified\" TIMESTAMP NOT NULL DEFAULT now(), \"title\" character varying NOT NULL, \"slug\" character varying NOT NULL, \"description\" character varying(250) NOT NULL, \"content\" character varying NOT NULL, \"status\" \"public\".\"article_status_enum\" NOT NULL DEFAULT 'PENDING', \"userId\" integer, CONSTRAINT \"UQ_0ab85f4be07b22d79906671d72f\" UNIQUE (\"slug\"), CONSTRAINT \"PK_40808690eb7b915046558c0f81b\" PRIMARY KEY (\"id\"))");
		await queryRunner.query("ALTER TABLE \"article\" ADD CONSTRAINT \"FK_636f17dadfea1ffb4a412296a28\" FOREIGN KEY (\"userId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("ALTER TABLE \"article\" DROP CONSTRAINT \"FK_636f17dadfea1ffb4a412296a28\"");
		await queryRunner.query("DROP TABLE \"article\"");
		await queryRunner.query("DROP TYPE \"public\".\"article_status_enum\"");
		await queryRunner.query("DROP TABLE \"user\"");
	}
}