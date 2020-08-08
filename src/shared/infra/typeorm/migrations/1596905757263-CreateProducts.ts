import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProducts1596905757263 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('products');
  }
}
