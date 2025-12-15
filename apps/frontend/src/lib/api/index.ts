import ky from "ky";
import { getRouter } from "@/router";

const API_URL = import.meta.env.VITE_API_URL || process.env.VITE_API_URL;

console.log(API_URL);

export const api = ky.create({
  prefixUrl: new URL("/api", API_URL).toString(),
  hooks: {
    beforeRequest: [
      async (request, options) => {
        const auth = options.context?.auth ?? true;

        if (auth) {
          const token = await cookieStore.get("access_token");

          if (token) {
            request.headers.set("Authorization", `Bearer ${token.value}`);
          }
        }
      },
    ],
    afterResponse: [
      async (_request, options, response) => {
        const auth = options.context?.auth ?? true;

        if (!auth) return;

        if (response.status === 401) {
          cookieStore.delete("access_token");

          getRouter().navigate({ to: "/auth/sign-in" });
          throw new Error("Unauthorized");
        }
      },
    ],
  },
});
