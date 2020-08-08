import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrders1596905663256 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('orders');
  }
}
