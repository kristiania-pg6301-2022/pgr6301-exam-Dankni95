import express from "express";
import * as path from "path";
import { ArticleWebSocket } from "./articleWebSocket.js";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { LoginApi } from "./loginApi.js";
import { WebSocketServer } from "ws";
import { ArticlesApi } from "./articlesApi.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const wsServer = new WebSocketServer({ noServer: true, path: "/" });

const sockets = [];

wsServer.on("connect", (socket) => {
  sockets.push(socket);

  const mongoClient = new MongoClient(process.env.MONGODB_URL);
  setTimeout(() => {}, 1000);

  socket.on("message", async function incoming(message) {
    const items = JSON.parse(message);

    if (items?.category !== null && items.category !== undefined) {
      mongoClient.connect().then(async () => {
        const articles = await ArticleWebSocket(
          mongoClient.db(process.env.MONGODB_DATABASE || "articles_db"),
          socket,
          items
        );
        wsServer.clients.forEach(function (client) {
          if (client === socket) client.send(JSON.stringify(articles));
        });
      });
    } else if (items?.title !== null && items.title !== undefined) {
      mongoClient.connect().then(async () => {
        const articles = await ArticleWebSocket(
          mongoClient.db(process.env.MONGODB_DATABASE || "articles_db"),
          socket,
          items
        );
        wsServer.clients.forEach(function (client) {
          client.send(JSON.stringify(articles));
        });
      });
    } else if (
      items?.deleteArticle !== null &&
      items.deleteArticle !== undefined
    ) {
      mongoClient.connect().then(async () => {
        const articles = await ArticleWebSocket(
          mongoClient.db(process.env.MONGODB_DATABASE || "articles_db"),
          socket,
          items
        );
        wsServer.clients.forEach(function (client) {
          client.send(JSON.stringify(articles));
        });
      });
    } else {
      // Send To Everyone Except Sender
      wsServer.clients.forEach(function (client) {
        if (client !== socket) client.send(JSON.stringify(items));
      });
    }
  });
});

app.use("/api/login", LoginApi());
app.use(express.static("../client/dist/"));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});
const mongoClient = new MongoClient(process.env.MONGODB_URL);
mongoClient.connect().then(async () => {
  console.log("connected");
  app.use(
    "/api/articles",
    ArticlesApi(
      mongoClient.db(process.env.MONGODB_DATABASE || "articles_db"),
      sockets
    )
  );
});

const server = app.listen(process.env.PORT || 3000, () => {
  server.on("upgrade", (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, (socket) => {
      wsServer.emit("connect", socket, req);
    });
  });
});
