import express from "express"
import * as path from "path"
import {ArticleWebSocket} from "./articleWebSocket.js"
import {MongoClient} from "mongodb"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import {LoginApi} from "./loginApi.js"
import {WebSocketServer} from "ws";
import {ArticlesApi} from "./articlesApi.js";

dotenv.config()

const app = express()
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))


const wsServer = new WebSocketServer({noServer: true, path: "/"});

const sockets = [];

wsServer.on("connect", (socket) => {
    sockets.push(socket);
    
    const mongoClient = new MongoClient(process.env.MONGODB_URL)
    setTimeout(() => {
        mongoClient.connect().then(async () => {
            mongoClient.connect().then(async () => {
                console.log("Connected to mongodb")
                await ArticleWebSocket(mongoClient.db(process.env.MONGODB_DATABASE || "pg6301-7"), socket)
            })
        })
    }, 1000);

    socket.on("message", (data) => {
        const items = JSON.parse(data);
        console.log("Sending message to all")
        for (const recipient of sockets) {
            recipient.send(items);
        }
    });
});

const mongoClient = new MongoClient(process.env.MONGODB_URL)
mongoClient.connect().then(async () => {
    app.use(
        "/api/articles",
        ArticlesApi(mongoClient.db(process.env.MONGODB_DATABASE || "pg6301-7")))
})


app.use("/api/login", LoginApi())
app.use(express.static("../client/dist/"))

app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
        res.sendFile(path.resolve("../client/dist/index.html"))
    } else {
        next()
    }
})


const server = app.listen(process.env.PORT || 3000, () => {
    server.on("upgrade", (req, socket, head) => {
        wsServer.handleUpgrade(req, socket, head, (socket) => {
            wsServer.emit("connect", socket, req);
        });
    });
});