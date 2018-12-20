const {
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
} = require('graphql')
const express = require('express')
const graphqlHTTP = require('express-graphql')

const Article = new GraphQLObjectType({
    name: 'Article',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        title: {
            type: GraphQLString,
        },
        content: {
            type: GraphQLString,
        },
        tags: {
            type: GraphQLList(Tag),
            resolve(self) {
                return self.__tags.map((tagID) => getTag(tagID))
            },
        },
        comments: {
            type: GraphQLList(Comment),
            args: {
                keyword: {
                    type: GraphQLString,
                },
            },
            resolve(self, { keyword }) {
                const commentList = self.__comments.map((commentID) => getComment(commentID))
                if (keyword) {
                    return commentList.filter((comment) => comment.content.includes(keyword))
                }
                return commentList
            },
        },
    }),
})

const Comment = new GraphQLObjectType({
    name: 'Comment',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        author: {
            type: GraphQLString,
        },
        content: {
            type: GraphQLString,
        },
    },
})

const Tag = new GraphQLObjectType({
    name: 'Tag',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
        name: {
            type: GraphQLString,
        },
        articles: {
            type: GraphQLList(Article),
            args: {
                keyword: {
                    type: GraphQLString,
                },
            },
            resolve(self, { keyword }) {
                const articleList = self.__articles.map((articleID) => getArticle(articleID))
                if (keyword) {
                    return articleList.filter((article) => article.content.includes(keyword))
                }
                return articleList
            },
        },
    }),
})

const makeArticle = (id, title, content, tags, comments) => {
    return {
        id,
        title,
        content,
        __tags: tags,
        __comments: comments,
    }
}

const makeTag = (id, name, articles) => {
    return {
        id,
        name,
        __articles: articles,
    }
}

const makeComment = (id, author, content) => {
    return {
        id,
        author,
        content,
    }
}

const FAKE_DB = {
    ARTICLE_LIST: [
        makeArticle('1', 'Learn Web Dev', 'Learn me', ['1', '3', '5'], ['1']),
        makeArticle('2', 'Happy Day', 'I am Happy', ['2', '4'], ['2', '3']),
        makeArticle('3', 'React Hooks Intro', 'I like hooks', ['1', '5'], ['4', '5']),
    ],
    TAG_LIST: [
        makeTag('1', 'Program', ['1', '3']),
        makeTag('2', 'Life', ['2']),
        makeTag('3', 'Web', ['1']),
        makeTag('4', 'Social', ['2']),
        makeTag('5', 'Development', ['1', '3']),
    ],
    COMMENT_LIST: [
        makeComment('1', 'Yan', 'Great Article'),
        makeComment('2', 'Luke', "That's Great"),
        makeComment('3', 'Leia', 'So Funny~ I like it.'),
        makeComment('4', 'Frodo', "That' awesome, make react dev easier."),
        makeComment('5', 'Bilbo', 'I like it.'),
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

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        articles: {
            type: GraphQLList(Article),
            args: {
                title: {
                    type: GraphQLString,
                    defaultValue: '',
                },
            },
            resolve(self, { title }) {
                return FAKE_DB.ARTICLE_LIST.filter((article) => article.title.includes(title))
            },
        },
        tags: {
            type: GraphQLList(Tag),
            args: {
                first: {
                    type: GraphQLInt,
                    defaultValue: 1,
                },
            },
            resolve(self, { first }) {
                return FAKE_DB.TAG_LIST.slice(0, first)
            },
        },
    },
})

var schema = new GraphQLSchema({ query: Query })

const app = express()
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true,
    }),
)
app.listen(8088)
