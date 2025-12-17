import * as Sentry from "@sentry/nestjs";

if (process.env.NODE_ENV === "production") {
  console.log("Initializing Sentry");
  Sentry.init({
    dsn: process.env.SENTRY_URL,
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    integrations: [
      Sentry.redisIntegration({
        cachePrefixes: ["users:", "transactions:", "transaction:", "categories:"],
      }),
    ],
  });
}
