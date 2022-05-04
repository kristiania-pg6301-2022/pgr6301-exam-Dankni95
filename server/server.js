import express from "express"
import * as path from "path"
import { ArticleApi } from "./articleApi.js"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import { LoginApi } from "./loginApi.js"

dotenv.config()

const app = express()
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))


const mongoClient = new MongoClient(process.env.MONGODB_URL)
mongoClient.connect().then(async () => {
  console.log("Connected to mongodb")
  app.use(
    "/api/articles",
    ArticleApi(mongoClient.db(process.env.MONGODB_DATABASE || "pg6301-7"))
  )
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
  console.log(`Started on http://localhost:${server.address().port}`)
})
