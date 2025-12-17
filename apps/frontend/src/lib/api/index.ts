import ky from "ky";
import { getRouter } from "@/router";
import { AuthService } from "@/services/AuthService";

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
        async (request, options, response) => {
          const auth = options.context?.auth ?? true;

          if (!auth) return;

          if (response.status === 401) {
            const refreshToken = await cookieStore.get("refresh_token");

            if (refreshToken?.value) {
              const auth = await AuthService.refreshToken(refreshToken.value);

              cookieStore.set({
                name: "access_token",
                value: auth.access_token,
                sameSite: "strict",
                path: "/",
              });

              cookieStore.set({
                name: "refresh_token",
                value: auth.refresh_token,
                sameSite: "strict",
                path: "/",
              });

              const headers = new Headers(request.headers);
              headers.set("Authorization", `Bearer ${auth.access_token}`);

              return ky.retry({
                request: new Request(request, { headers }),
                code: "TOKEN_REFRESHED",
              });
            }

            getRouter().navigate({ to: "/auth/sign-in" });
            throw new Error("Unauthorized");
          }
        },
      ],
    },
  });
};
