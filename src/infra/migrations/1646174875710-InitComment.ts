import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';
import { COMMENT_TABLE_NAME } from '../../entities/Comment';

export class InitComment1646174875710 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: COMMENT_TABLE_NAME,
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
            name: 'author_id',
            type: 'varchar',
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
      COMMENT_TABLE_NAME,
      new TableIndex({
        name: 'IDX_COMMENTS_DISCUSSION_ID',
        columnNames: ['discussion_id'],
      })
    );

    await queryRunner.createForeignKey(
      COMMENT_TABLE_NAME,
      new TableForeignKey({
        columnNames: ['parent_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: COMMENT_TABLE_NAME,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(COMMENT_TABLE_NAME);
    if (!table) throw new Error('No table found: ' + COMMENT_TABLE_NAME);
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('parent_id') !== -1);
    if (!foreignKey) throw new Error('No foreign key found');
    await queryRunner.dropForeignKey(COMMENT_TABLE_NAME, foreignKey);
    await queryRunner.dropIndex(COMMENT_TABLE_NAME, 'IDX_COMMENTS_DISCUSSION_ID');
    await queryRunner.dropTable(COMMENT_TABLE_NAME);
  }
}
