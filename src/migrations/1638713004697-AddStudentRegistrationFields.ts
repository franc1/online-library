import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStudentRegistrationFields1638713004697
  implements MigrationInterface
{
  name = 'AddStudentRegistrationFields1638713004697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student" ADD "is_registered" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "student" ADD "registration_code" character varying(100)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student" DROP COLUMN "registration_code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student" DROP COLUMN "is_registered"`,
    );
  }
}
