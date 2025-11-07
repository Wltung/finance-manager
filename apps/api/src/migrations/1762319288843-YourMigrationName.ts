import { MigrationInterface, QueryRunner } from "typeorm";

export class YourMigrationName1762319288843 implements MigrationInterface {
    name = 'YourMigrationName1762319288843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."attachment_type_enum" AS ENUM('image', 'pdf', 'other')`);
        await queryRunner.query(`CREATE TABLE "attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "type" "public"."attachment_type_enum" NOT NULL DEFAULT 'image', "description" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "transaction_id" uuid, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."recurring_transaction_frequency_enum" AS ENUM('daily', 'weekly', 'monthly', 'yearly')`);
        await queryRunner.query(`CREATE TABLE "recurring_transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(15,2) NOT NULL, "description" character varying(255), "frequency" "public"."recurring_transaction_frequency_enum" NOT NULL DEFAULT 'monthly', "startDate" date NOT NULL, "endDate" date, "next_execution_date" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "user_id" uuid, "category_id" integer, "wallet_id" uuid, CONSTRAINT "PK_6f2199a889c8e4de41bcc2ca46c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(15,2) NOT NULL, "description" character varying(255), "date" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "user_id" uuid, "category_id" integer, "wallet_id" uuid, "recurring_transaction_id" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."budget_period_enum" AS ENUM('monthly', 'quarterly', 'yearly')`);
        await queryRunner.query(`CREATE TABLE "budget" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(15,2) NOT NULL, "period" "public"."budget_period_enum" NOT NULL DEFAULT 'monthly', "startDate" date NOT NULL, "endDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "user_id" uuid, "category_id" integer, CONSTRAINT "PK_9af87bcfd2de21bd9630dddaa0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."category_type_enum" AS ENUM('income', 'expense')`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "type" "public"."category_type_enum" NOT NULL DEFAULT 'expense', "icon" character varying(50), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, "isRevoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying, "tokenVersion" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."wallet_type_enum" AS ENUM('cash', 'bank_account', 'credit_card')`);
        await queryRunner.query(`CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "type" "public"."wallet_type_enum" NOT NULL DEFAULT 'cash', "balance" numeric(15,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "password_resets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hashedToken" character varying(255) NOT NULL, "userId" uuid NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "usedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4816377aa98211c1de34469e742" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attachment" ADD CONSTRAINT "FK_2b2d9c37fd1afe2b941407f37dd" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ADD CONSTRAINT "FK_a84dfb2a69ab7ef06bc178bd3b7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ADD CONSTRAINT "FK_a620e94b44a4fb5cba46d226b87" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ADD CONSTRAINT "FK_45e216cb411f0deea8ee7440268" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_b4a3d92d5dde30f3ab5c34c5862" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_abbe63b71ee4193f61c322ab497" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_08081d10759ec250c557cebd81a" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_8f94f26d8914f74f854d2b6c158" FOREIGN KEY ("recurring_transaction_id") REFERENCES "recurring_transaction"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget" ADD CONSTRAINT "FK_68df09bd8001a1fb0667a9b42f7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget" ADD CONSTRAINT "FK_af6f95ccfa1f460edca6b488803" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_6562e564389d0600e6e243d9604" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_72548a47ac4a996cd254b082522" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password_resets" ADD CONSTRAINT "FK_d95569f623f28a0bf034a55099e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_resets" DROP CONSTRAINT "FK_d95569f623f28a0bf034a55099e"`);
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_72548a47ac4a996cd254b082522"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_6562e564389d0600e6e243d9604"`);
        await queryRunner.query(`ALTER TABLE "budget" DROP CONSTRAINT "FK_af6f95ccfa1f460edca6b488803"`);
        await queryRunner.query(`ALTER TABLE "budget" DROP CONSTRAINT "FK_68df09bd8001a1fb0667a9b42f7"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_8f94f26d8914f74f854d2b6c158"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_08081d10759ec250c557cebd81a"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_abbe63b71ee4193f61c322ab497"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_b4a3d92d5dde30f3ab5c34c5862"`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" DROP CONSTRAINT "FK_45e216cb411f0deea8ee7440268"`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" DROP CONSTRAINT "FK_a620e94b44a4fb5cba46d226b87"`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" DROP CONSTRAINT "FK_a84dfb2a69ab7ef06bc178bd3b7"`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP CONSTRAINT "FK_2b2d9c37fd1afe2b941407f37dd"`);
        await queryRunner.query(`DROP TABLE "password_resets"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
        await queryRunner.query(`DROP TYPE "public"."wallet_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TYPE "public"."category_type_enum"`);
        await queryRunner.query(`DROP TABLE "budget"`);
        await queryRunner.query(`DROP TYPE "public"."budget_period_enum"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "recurring_transaction"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transaction_frequency_enum"`);
        await queryRunner.query(`DROP TABLE "attachment"`);
        await queryRunner.query(`DROP TYPE "public"."attachment_type_enum"`);
    }

}
