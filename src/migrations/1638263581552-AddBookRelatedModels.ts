import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookRelatedModels1638263581552 implements MigrationInterface {
  name = 'AddBookRelatedModels1638263581552';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "book_publisher" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "address" character varying(150), CONSTRAINT "PK_baaa4c0d27070b4125aa5a81e25" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bc5806dd4a415f753fe720c59" ON "book_publisher" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "printing_office" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "address" character varying(150), CONSTRAINT "PK_4b54846b868eed8ee16c494e530" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7f153c43a0c477c5fa37b6d260" ON "printing_office" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."book_status_enum" AS ENUM('free', 'issued')`,
    );
    await queryRunner.query(
      `CREATE TABLE "book" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "author" character varying(100) NOT NULL, "status" "public"."book_status_enum" NOT NULL DEFAULT 'free', "isbn" character varying(50) NOT NULL, "picture" character varying(150), "publication_date" date, "book_category_id" uuid, "book_publisher_id" uuid, "printing_office_id" uuid, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1bf2b5d9eaa5aa1afbe701ed16" ON "book" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "book_category" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, CONSTRAINT "PK_0bfe418ce140d4720d0eede7c3e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10cc54212f609a4f7c256f267b" ON "book_category" ("deleted_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "FK_efefb5ac6cce99475e4f9eeb5de" FOREIGN KEY ("book_category_id") REFERENCES "book_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "FK_ed180f2aea67bbf25c992517802" FOREIGN KEY ("book_publisher_id") REFERENCES "book_publisher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ADD CONSTRAINT "FK_eb53caf62d2f1998e7b7b84c7e4" FOREIGN KEY ("printing_office_id") REFERENCES "printing_office"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "FK_eb53caf62d2f1998e7b7b84c7e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "FK_ed180f2aea67bbf25c992517802"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" DROP CONSTRAINT "FK_efefb5ac6cce99475e4f9eeb5de"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_10cc54212f609a4f7c256f267b"`,
    );
    await queryRunner.query(`DROP TABLE "book_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1bf2b5d9eaa5aa1afbe701ed16"`,
    );
    await queryRunner.query(`DROP TABLE "book"`);
    await queryRunner.query(`DROP TYPE "public"."book_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7f153c43a0c477c5fa37b6d260"`,
    );
    await queryRunner.query(`DROP TABLE "printing_office"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bc5806dd4a415f753fe720c59"`,
    );
    await queryRunner.query(`DROP TABLE "book_publisher"`);
  }
}
