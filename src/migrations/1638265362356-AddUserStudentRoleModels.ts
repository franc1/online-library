import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserStudentRoleModels1638265362356
  implements MigrationInterface
{
  name = 'AddUserStudentRoleModels1638265362356';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "student" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "personal_id" character(13) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "role_id" INTEGER NOT NULL, CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c5f711c0b5fbe7bbf3a588d5c8" ON "student" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "personal_id" character(13), "picture" character varying(150), "address" character varying(150), "role_id" INTEGER NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_22b81d3ed19a0bffcb660800f4" ON "user" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_538f3a911ceed8b2823a19d2e5" ON "role" ("deleted_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "student" ADD CONSTRAINT "FK_ffc0d7fecec8c0b216986095154" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "FK_ffc0d7fecec8c0b216986095154"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_538f3a911ceed8b2823a19d2e5"`,
    );
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_22b81d3ed19a0bffcb660800f4"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c5f711c0b5fbe7bbf3a588d5c8"`,
    );
    await queryRunner.query(`DROP TABLE "student"`);
  }
}
