# `graphql` with [graphql-js](https://github.com/graphql/graphql-js/)

## two versions of a blog system implemention

```graphql
type Article {
    id: ID!
    title: String
    content: String
    tags: [Tag]
    comments(keyword: String): [Comment]
}
type Tag {
    id: ID!
    name: String
    articles(keyword: String): [Article]
}
type Comment {
    id: ID
    author: String
    content: String
}
type Query {
    articles: [Article]
    tags: [Tag]
}
```

## usage

```bash
npm install
npm start
```

then

- visit: http://127.0.0.1:8080 for the `buildSchema` version
- visit: http://127.0.0.1:8088 for the `GraphQLObjectType` version