import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitalRoles1638277436483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO role (name) VALUES ('ADMIN'), ('LIBRARIAN'), ('STUDENT');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
