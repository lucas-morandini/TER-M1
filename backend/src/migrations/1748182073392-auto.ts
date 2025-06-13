import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1748182073392 implements MigrationInterface {
    name = 'Auto1748182073392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Notifications\` (\`id\` varchar(255) NOT NULL, \`message\` varchar(255) NOT NULL, \`soldeUpdate\` int NOT NULL, \`title\` varchar(255) NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Notifications\` ADD CONSTRAINT \`FK_28a9de2f34e218f2ccc746ed4f7\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Notifications\` DROP FOREIGN KEY \`FK_28a9de2f34e218f2ccc746ed4f7\``);
        await queryRunner.query(`DROP TABLE \`Notifications\``);
    }

}
