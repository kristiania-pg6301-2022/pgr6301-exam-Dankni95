import request from "supertest"
import express from "express"
import {MongoClient} from "mongodb"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import {ArticlesApi} from "../articlesApi.js";
import WS from "jest-websocket-mock";

dotenv.config()

const app = express()
app.use(bodyParser.json())

const mongoClient = new MongoClient(process.env.MONGODB_URL)
const server = new WS("ws://localhost:1234");
const client = new WebSocket("ws://localhost:1234");

afterAll(() => {
    mongoClient.close()
    client.close()
    server.close()
})

describe("article api", () => {
    it("adds a new article", async () => {
        const title = "My Test article"
        const content = "my content"
        const name = "Danny"
        const category = "Politics"
        const date = new Date().toLocaleDateString()

        await mongoClient.connect()
        const database = mongoClient.db("test_database")
        await database.collection("articles").deleteMany({})


        await server.connected;

        let socket = []

        socket.push(client)

        app.use("/api/articles", ArticlesApi(database, socket))

        expect(
            (
                await request(app).post("/api/articles").send({title, content, category, name, date}).expect(200)
            ).body
        ).toEqual([{category: [category.toLowerCase()], content, date, name, title}])
    })

    it("adds new article, fails because exists", async () => {
        const title = "My Test article"
        const content = "my content"
        const name = "Danny"
        const category = "Politics"
        const date = new Date().toLocaleDateString()

        await mongoClient.connect()
        const database = mongoClient.db("test_database")


        await server.connected;

        let socket = []

        socket.push(client)

        app.use("/api/articles", ArticlesApi(database, socket))

     
        await request(app).post("/api/articles").send({title, content, category, name, date}).expect(400)
        await database.collection("articles").deleteMany({})

    })

    it("adds a new article, fails when title empty", async () => {
        const title = ""
        const content = "my content"
        const name = "Danny"
        const category = "Politics"
        const date = new Date().toLocaleDateString()

        await mongoClient.connect()
        const database = mongoClient.db("test_database")
        await database.collection("articles").deleteMany({})


        await server.connected;

        let socket = []

        socket.push(client)

        app.use("/api/articles", ArticlesApi(database, socket))
                await request(app).post("/api/articles").send({title, content, category, name, date}).expect(400)
        await database.collection("articles").deleteMany({})

    })
})


