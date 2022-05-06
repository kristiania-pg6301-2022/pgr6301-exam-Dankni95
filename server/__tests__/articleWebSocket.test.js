import request from "supertest";
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { ArticleWebSocket } from "../articleWebSocket.js";
import WS from "jest-websocket-mock";
import { ArticlesApi } from "../articlesApi.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const server = new WS("ws://localhost:1234");
const client = new WebSocket("ws://localhost:1234");
const mongoClient = new MongoClient(process.env.MONGODB_URL);

describe("article websocket", () => {
  afterAll(async () => {
    await mongoClient.connect().then(async (con) => {
      await con.db("test_database").collection("articles").deleteMany({});
    });
    client.close();
    server.close();
  }, 1000);

  beforeEach(async () => {
    await mongoClient.connect().then(async (con) => {
      await con.db("test_database").collection("articles").deleteMany({});
    });
  });

  it("gets an article", async () => {
    const title = "New test article";
    const content = "Wow new content";
    const name = "Dan the man";
    const category = "Health";
    const date = new Date().toLocaleDateString();

    await server.connected;

    let socket = [];

    socket.push(client);

    await mongoClient.connect();
    const database = await mongoClient.db("test_database");

    app.use("/api/articles", ArticlesApi(await database, socket));

    //save data for test
    await request(app)
      .post("/api/articles")
      .send({ title, content, category, name, date })
      .expect(200);

    // begin test
    await ArticleWebSocket(database, socket, { category: "" }).then(
      async (ar) => {
        expect(await ar[0].content).toStrictEqual(content);
      }
    );
  });

  it("gets all articles with category Health", async () => {
    const title = "New test article";
    const content = "Wow new content";
    const name = "Dan the man";
    const category = "Health";
    const date = new Date().toLocaleDateString();

    await mongoClient.connect();
    const database = await mongoClient.db("test_database");

    await server.connected;

    let socket = [];

    socket.push(client);

    app.use("/api/articles", ArticlesApi(database, socket));

    //save data for test
    await request(app)
      .post("/api/articles")
      .send({ title, content, category, name, date })
      .expect(200);

    //begin test
    await ArticleWebSocket(database, socket, {
      category: "Health",
    }).then(async (ar) => {
      expect(await ar[0].category).toStrictEqual([category.toLowerCase()]);
    });
  });
});
