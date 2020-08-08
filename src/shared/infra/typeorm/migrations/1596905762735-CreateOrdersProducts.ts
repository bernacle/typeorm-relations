import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrdersProducts1596905762735 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'orders_products',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('orders_products');
  }
}
