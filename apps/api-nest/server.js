require("dotenv/config");

const { NestFactory } = require("@nestjs/core");
const { ExpressAdapter } = require("@nestjs/platform-express");
const express = require("express");

const { AppModule } = require("./dist/src/app.module");

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.setGlobalPrefix("api");
  app.enableCors();

  await app.init();
  return server;
}

module.exports = async function handler(req, res) {
  try {
    const serverInstance = await bootstrap();
    serverInstance(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
