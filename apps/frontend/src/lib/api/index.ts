import ky from "ky";
import { getRouter } from "@/router";

export const getApi = () => {
  return ky.create({
    prefixUrl: new URL("/api", import.meta.env.VITE_API_URL || "https://finance-api.hcardoso.com.br").toString(),
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
};
