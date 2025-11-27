import "dotenv/config";

import { serve } from "@hono/node-server";
import app from "./server.js";

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:3000
  },
);
