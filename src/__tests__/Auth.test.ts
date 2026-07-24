import express from "express";
import request from "supertest";
import { auth } from "../middlewares/auth";

describe("Middleware Auth", () => {
  const app = express();

  app.get("/privado", auth, (req, res) => {
    res.status(200).json({ mensagem: "OK" });
  });

  test("deve retornar 401 sem token", async () => {
    const response = await request(app).get("/privado");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      mensagem: "Usuário não autenticado"
    });
  });

  test("deve permitir acesso com token", async () => {
    const response = await request(app)
      .get("/privado")
      .set("Authorization", "Bearer token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensagem: "OK"
    });
  });
});import express from "express";
import request from "supertest";
import { auth } from "../middlewares/auth";

describe("Middleware Auth", () => {
  const app = express();

  app.get("/privado", auth, (req, res) => {
    res.status(200).json({ mensagem: "OK" });
  });

  test("deve retornar 401 sem token", async () => {
    const response = await request(app).get("/privado");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      mensagem: "Usuário não autenticado"
    });
  });

  test("deve permitir acesso com token", async () => {
    const response = await request(app)
      .get("/privado")
      .set("Authorization", "Bearer token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensagem: "OK"
    });
  });
});import express from "express";
import request from "supertest";
import { auth } from "../middlewares/auth";

describe("Middleware Auth", () => {
  const app = express();

  app.get("/privado", auth, (req, res) => {
    res.status(200).json({ mensagem: "OK" });
  });

  test("deve retornar 401 sem token", async () => {
    const response = await request(app).get("/privado");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      mensagem: "Usuário não autenticado"
    });
  });

  test("deve permitir acesso com token", async () => {
    const response = await request(app)
      .get("/privado")
      .set("Authorization", "Bearer token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      mensagem: "OK"
    });
  });
});