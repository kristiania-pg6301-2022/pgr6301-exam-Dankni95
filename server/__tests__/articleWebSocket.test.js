import request from "supertest"
import express from "express"
import {MongoClient} from "mongodb"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import {ArticleWebSocket} from "../articleWebSocket.js"
import WS from "jest-websocket-mock";
import {ArticlesApi} from "../articlesApi.js";

dotenv.config()

const app = express()
app.use(bodyParser.json())

const server = new WS("ws://localhost:1234");
const client = new WebSocket("ws://localhost:1234");
const mongoClient = new MongoClient(process.env.MONGODB_URL)

afterAll(() => {
    mongoClient.close()
    client.close()
    server.close()
})

describe("article websocket", () => {
    it("gets an article", async () => {


        const title = "New test article"
        const content = "Wow new content"
        const name = "Dan the man"
        const category = "Health"
        const date = new Date().toLocaleDateString()

        await mongoClient.connect()
        const database = mongoClient.db("test_database")
        await database.collection("articles").deleteMany({})

        await server.connected;

        let socket = []

        socket.push(client)

        app.use("/api/articles", ArticlesApi(database, socket))

        //save data for test
        await request(app).post("/api/articles").send({title, content, category, name, date}).expect(200)

        // begin test
        const articles = await ArticleWebSocket(mongoClient.db("test_database"), socket, {category: ""})

        expect(
            await articles
        ).toEqual([{category: [category.toLowerCase()], content, date, name, title}])
        await database.collection("articles").deleteMany({})
    })

    it("gets all articles with category Health", async () => {
        const title = "New test article"
        const content = "Wow new content"
        const name = "Dan the man"
        const category = "Health"
        const date = new Date().toLocaleDateString()

        await mongoClient.connect()
        const database = mongoClient.db("test_database")
        await database.collection("articles").deleteMany({})

        await server.connected;

        let socket = []

        socket.push(client)

        app.use("/api/articles", ArticlesApi(database, socket))

        //save data for test
        await request(app).post("/api/articles").send({title, content, category, name, date}).expect(200)

        //begin test
        await mongoClient.connect()
        const articles = await ArticleWebSocket(mongoClient.db("test_database"), socket, {category: "Health"})
        expect(await articles[0].category).toStrictEqual([category.toLowerCase()])

        await database.collection("articles").deleteMany({})
        await mongoClient.close()
    })
})


