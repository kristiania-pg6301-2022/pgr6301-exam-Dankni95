import request from "supertest";
import express from "express";
import { LoginApi } from "../loginApi.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

describe("login api", () => {
  it("tests google config", async () => {
    app.use("/api/login", LoginApi());

    await request(app).get("/api/login").expect(200);
    expect(
      (await request(app).get("/api/login").expect(200)).body.config.google
        .client_id
    ).toContain(process.env.GOOGLE_CLIENT_ID);
  });

  it("tests openid config", async () => {
    app.use("/api/login", LoginApi());

    await request(app).get("/api/login").expect(200);
    expect(
      (await request(app).get("/api/login").expect(200)).body.config.openid
        .client_id
    ).toContain(process.env.IDPORTEN_CLIENT_ID);
  });
});
