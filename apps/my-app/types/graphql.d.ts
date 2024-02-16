declare module '*.graphql' {
  import { DocumentNode } from 'graphql/language/ast';

  const Schema: DocumentNode;

  export = Schema;
}
