import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1748190985111 implements MigrationInterface {
    name = 'Auto1748190985111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Payments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` int NOT NULL, \`type\` enum ('deposit', 'withdrawal') NOT NULL, \`status\` enum ('pending', 'completed', 'failed') NOT NULL, \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`iban\` varchar(34) NULL, \`bic\` varchar(11) NULL, \`accountHolderName\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Payments\` ADD CONSTRAINT \`FK_61e80a03a53cf7b8a01aed56451\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Payments\` DROP FOREIGN KEY \`FK_61e80a03a53cf7b8a01aed56451\``);
        await queryRunner.query(`DROP TABLE \`Payments\``);
    }

}
