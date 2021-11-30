import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookRequestModel1638268387728 implements MigrationInterface {
  name = 'AddBookRequestModel1638268387728';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."book_request_request_status_enum" AS ENUM('requested', 'accepted', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."book_request_back_request_status_enum" AS ENUM('requested', 'accepted', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "book_request" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "request_date" TIMESTAMP WITH TIME ZONE NOT NULL, "request_status" "public"."book_request_request_status_enum" NOT NULL DEFAULT 'requested', "request_resolved_date" TIMESTAMP WITH TIME ZONE, "back_request_date" TIMESTAMP WITH TIME ZONE, "back_request_status" "public"."book_request_back_request_status_enum", "back_request_resolved_date" TIMESTAMP WITH TIME ZONE, "student_id" INTEGER NOT NULL, "book_id" INTEGER NOT NULL, "request_resolved_by" INTEGER, "back_request_resolved_by" INTEGER, CONSTRAINT "PK_b858047bddd5d757cd3bd2c4dcd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c6944a8a20a76cbae120c272b6" ON "book_request" ("deleted_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "book_request" ADD CONSTRAINT "FK_1503da60fb52d9944b4bf695a53" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_request" ADD CONSTRAINT "FK_f9330189d7a828d8b038251c300" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_request" ADD CONSTRAINT "FK_7904bf73f145f987ee84c36f2a4" FOREIGN KEY ("request_resolved_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_request" ADD CONSTRAINT "FK_552243401267a1b4f84d9601d35" FOREIGN KEY ("back_request_resolved_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book_request" DROP CONSTRAINT "FK_552243401267a1b4f84d9601d35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_request" DROP CONSTRAINT "FK_7904bf73f145f987ee84c36f2a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_request" DROP CONSTRAINT "FK_f9330189d7a828d8b038251c300"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_request" DROP CONSTRAINT "FK_1503da60fb52d9944b4bf695a53"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c6944a8a20a76cbae120c272b6"`,
    );
    await queryRunner.query(`DROP TABLE "book_request"`);
    await queryRunner.query(
      `DROP TYPE "public"."book_request_back_request_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."book_request_request_status_enum"`,
    );
  }
}
