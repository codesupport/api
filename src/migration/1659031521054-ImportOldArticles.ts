import { MigrationInterface, QueryRunner } from "typeorm";

const userIdMap = {
    1: 1,
    2: undefined,
    3: "jason",
    4: "kayomn",
    5: "jamie",
    6: "sara"
};


export class ImportOldArticles1659031521054 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
