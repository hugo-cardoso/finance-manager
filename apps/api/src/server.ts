import { Hono } from "hono";
import { cors } from "hono/cors";

import { createRoutes } from "./routes/index.js";

const app = new Hono().basePath("/api");

app.use("*", cors());

createRoutes(app);

export default app;
