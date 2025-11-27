import { decodeJwt } from "jose";
import ky from "ky";

import { AuthService } from "@/services/AuthService";

export const api = ky.create({
  prefixUrl: new URL("/api", import.meta.env.VITE_API_URL).toString(),
  hooks: {
    beforeRequest: [
      async (request, options) => {
        const auth = options.context?.auth ?? true;

        if (!auth) return;

        const token = window.localStorage.getItem("access_token");

        if (!token) {
          throw new Error("Unauthorized");
        }

        const decoded = decodeJwt(token);

        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          const refreshToken = window.localStorage.getItem("refresh_token");
          const response = await AuthService.refreshToken(refreshToken as string);

          window.localStorage.setItem("access_token", response.access_token);
          window.localStorage.setItem("refresh_token", response.refresh_token);
          window.localStorage.setItem("expires_at", response.expires_at.toString());

          request.headers.set("Authorization", `Bearer ${response.access_token}`);
          return;
        }

        request.headers.set("Authorization", `Bearer ${token}`);
      },
    ],
  },
});
