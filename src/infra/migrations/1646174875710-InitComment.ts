import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

const tableName = 'comments';

export class InitComment1646174875710 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: '_id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'discussion_id',
            type: 'varchar(256)',
            isNullable: false,
          },
          {
            name: 'parent_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'content_markdown',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      tableName,
      new TableIndex({
        name: 'IDX_COMMENTS_DISCUSSION_ID',
        columnNames: ['discussion_id'],
      })
    );

    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        columnNames: ['parent_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: tableName,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(tableName);
    if (!table) throw new Error('No table found: ' + tableName);
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('parent_id') !== -1);
    if (!foreignKey) throw new Error('No foreign key found');
    await queryRunner.dropForeignKey(tableName, foreignKey);
    await queryRunner.dropIndex(tableName, 'IDX_COMMENTS_DISCUSSION_ID');
    await queryRunner.dropTable(tableName);
  }
}
