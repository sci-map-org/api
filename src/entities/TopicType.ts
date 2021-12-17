export const TopicTypeLabel = 'TopicType';

export interface TopicType {
  name: string; // case insensitive
  iconName?: string;
  color?: TopicTypeColor;
}

export enum TopicTypeColor {
  orange = 'orange',
  red = 'red',
  green = 'green',
  blue = 'blue',
}
