import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const COMMENT_TABLE_NAME = 'comments';

@Entity({
  name: COMMENT_TABLE_NAME,
})
export class Comment {
  @PrimaryGeneratedColumn()
  _id: string;

  @Column()
  discussion_id: string;

  @Column({
    type: 'varchar',
  })
  parent_id: string | null;

  @Column()
  content_markdown: string;

  @Column()
  author_id: string;

  @Column()
  created_at: string;
}
