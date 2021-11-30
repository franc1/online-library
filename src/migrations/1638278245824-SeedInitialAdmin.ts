import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialAdmin1638278245824 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // retrieve roleId of ADMIN role
    const adminRoleId: number = (
      await queryRunner.query(`SELECT id FROM role WHERE name = 'ADMIN'`)
    ).map((r: any) => r.id)[0];

    // prepared hashed password (for 123456)
    const password =
      '$2a$12$p4RiT0JjtIBTRVqiQ58ubefrXORwCxXR8HDeUPLNjnDbolomwGRMS';

    // Insert first admin user
    await queryRunner.query(
      `INSERT INTO "user" (first_name, last_name, email, password, role_id)
      VALUES ('Admin', 'Admin', 'admin@example.com', '${password}', ${adminRoleId});`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
