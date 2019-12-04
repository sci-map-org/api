export enum ArticleContentType {
  Markdown = 'markdown',
}

export interface Article {
  _id: string;
  key: string;
  contentType: ArticleContentType;
  title: string;
  content: string;
}
