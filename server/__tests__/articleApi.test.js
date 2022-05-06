import request from "supertest";
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { ArticlesApi } from "../articlesApi.js";
import WS from "jest-websocket-mock";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const mongoClient = new MongoClient(process.env.MONGODB_URL);
const server = new WS("ws://localhost:1234");
const client = new WebSocket("ws://localhost:1234");

describe("article api", () => {
  afterAll(async () => {
    await mongoClient.connect().then(async (con) => {
      await con.db("test_database").collection("articles").deleteMany({});
    });
    client.close();
    server.close();
  }, 1000);

  beforeEach(async () => {
    const db = await mongoClient.connect();
    await db.db("test_database").collection("articles").deleteMany({});
    await db.close();
  });

  it("adds a new article", async () => {
    await server.connected;

    let socket = [];

    socket.push(client);

    const title = "My Test article";
    const content = "my content";
    const name = "Danny";
    const category = "Politics";
    const date = new Date().toLocaleDateString();

    await mongoClient.connect().then(async (con) => {
      let connection = await con.db("test_database");
      app.use("/api/articles", ArticlesApi(await connection, socket));
    });

    expect(
      (
        await request(app)
          .post("/api/articles")
          .send({ title, content, category, name, date })
          .expect(200)
      ).body[0].title
    ).toEqual(title);
  });

  it("adds new article, fails because exists", async () => {
    const title = "My Test article";
    const content = "my content";
    const name = "Danny";
    const category = "Politics";
    const date = new Date().toLocaleDateString();

    await server.connected;
    let socket = [];
    socket.push(client);

    await mongoClient.connect();
    const database = await mongoClient.db("test_database");

    app.use("/api/articles", ArticlesApi(await database, socket));

    //insert data
    await request(app)
      .post("/api/articles")
      .send({ title, content, category, name, date })
      .expect(200);

    //use data
    await request(app)
      .post("/api/articles")
      .send({ title, content, category, name, date })
      .expect(400);
  });

  it("adds a new article, fails when title empty", async () => {
    const title = "";
    const content = "my content";
    const name = "Danny";
    const category = "Politics";
    const date = new Date().toLocaleDateString();

    await mongoClient.connect();
    await server.connected;

    let socket = [];

    socket.push(client);
    const db = await mongoClient.db("test_database");

    app.use("/api/articles", ArticlesApi(await db, socket));
    await request(app)
      .post("/api/articles")
      .send({ title, content, category, name, date })
      .expect(400);
  });
});
