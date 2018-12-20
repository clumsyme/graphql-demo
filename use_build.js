const { buildSchema } = require('graphql')
const express = require('express')
const graphqlHTTP = require('express-graphql')

const schema = buildSchema(`
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
`)

class Article {
    constructor(id, title, content, tags, comments) {
        this.id = id
        this.title = title
        this.content = content

        this.__tags = tags
        this.__comments = comments
    }

    tags() {
        return this.__tags.map((tagID) => getTag(tagID))
    }

    comments({ keyword }) {
        const commentList = this.__comments.map((commentID) => getComment(commentID))
        if (keyword) {
            return commentList.filter((comment) => comment.content.includes(keyword))
        }
        return commentList
    }
}

class Tag {
    constructor(id, name, articles) {
        this.id = id
        this.name = name

        this.__articles = articles
    }

    articles({ keyword }) {
        const articleList = this.__articles.map((articleID) => getArticle(articleID))
        if (keyword) {
            return articleList.filter((article) => article.content.includes(keyword))
        }
        return articleList
    }
}

class Comment {
    constructor(id, author, content) {
        this.id = id
        this.author = author
        this.content = content
    }
}

const FAKE_DB = {
    ARTICLE_LIST: [
        new Article('1', 'Learn Web Dev', 'Learn me', ['1', '3', '5'], ['1']),
        new Article('2', 'Happy Day', 'I am Happy', ['2', '4'], ['2', '3']),
        new Article('3', 'React Hooks Intro', 'I like hooks', ['1', '5'], ['4', '5']),
    ],
    TAG_LIST: [
        new Tag('1', 'Program', ['1', '3']),
        new Tag('2', 'Life', ['2']),
        new Tag('3', 'Web', ['1']),
        new Tag('4', 'Social', ['2']),
        new Tag('5', 'Development', ['1', '3']),
    ],
    COMMENT_LIST: [
        new Comment('1', 'Yan', 'Great Article'),
        new Comment('2', 'Luke', "That's Great"),
        new Comment('3', 'Leia', 'So Funny~ I like it.'),
        new Comment('4', 'Frodo', "That' awesome, make react dev easier."),
        new Comment('5', 'Bilbo', 'I like it.'),
    ],
}

function getArticle(id) {
    return FAKE_DB.ARTICLE_LIST.filter((article) => article.id === id)[0]
}

function getTag(id) {
    return FAKE_DB.TAG_LIST.filter((tag) => tag.id === id)[0]
}

function getComment(id) {
    return FAKE_DB.COMMENT_LIST.filter((comment) => comment.id === id)[0]
}

const rootValue = {
    articles: ({title}) => {
        return FAKE_DB.ARTICLE_LIST.filter((article) => article.title.includes(title))
    },
    tags: ({first}) => {
        return FAKE_DB.TAG_LIST.slice(0, first)
    }
}

const app = express()
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        rootValue,
        graphiql: true,
    }),
)
app.listen(8080)
