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
    id: ID!
    author: String
    content: String
}
type Query {
    articles(title: String): [Article]
    tags(first: Int): [Tag]
}
```

## usage

```bash
npm install
npm start
```

then

-   visit: http://127.0.0.1:8080 for the `buildSchema` version
-   visit: http://127.0.0.1:8088 for the `GraphQLObjectType` version

give the following `query`

```graphql
query myBlog($articleTitle: String, $show: Boolean!, $first: Int) {
    articles(title: $articleTitle) {
        title
        tags {
            name
        }
        comments {
            ...comments
        }
    }
    tags(first: $first) {
        name
        articleList: articles @include(if: $show) {
            title
            comments {
                ...comments
            }
        }
    }
}

fragment comments on Comment {
    author
    content
}
```

and the following `query variables`

```json
{
    "articleTitle": "React",
    "show": true,
    "first": 2
}
```

we will get

```json
{
    "data": {
        "articles": [
            {
                "title": "React Hooks Intro",
                "tags": [
                    {
                        "name": "Program"
                    },
                    {
                        "name": "Development"
                    }
                ],
                "comments": [
                    {
                        "author": "Frodo",
                        "content": "That' awesome, make react dev easier."
                    },
                    {
                        "author": "Bilbo",
                        "content": "I like it."
                    }
                ]
            }
        ],
        "tags": [
            {
                "name": "Program",
                "articleList": [
                    {
                        "title": "Learn Web Dev",
                        "comments": [
                            {
                                "author": "Yan",
                                "content": "Great Article"
                            }
                        ]
                    },
                    {
                        "title": "React Hooks Intro",
                        "comments": [
                            {
                                "author": "Frodo",
                                "content": "That' awesome, make react dev easier."
                            },
                            {
                                "author": "Bilbo",
                                "content": "I like it."
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Life",
                "articleList": [
                    {
                        "title": "Happy Day",
                        "comments": [
                            {
                                "author": "Luke",
                                "content": "That's Great"
                            },
                            {
                                "author": "Leia",
                                "content": "So Funny~ I like it."
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
```
