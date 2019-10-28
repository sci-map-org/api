import monk from 'monk';

export const db = monk('mongodb://localhost:27017/apollo_dev');
