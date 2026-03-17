import { io, type Socket } from "socket.io-client";
import { env } from "../../app/config/env";

function getSocketBaseUrl(apiUrl: string) {
  // env.API_URL is guaranteed to end with /api
  if (apiUrl.endsWith("/api")) return apiUrl.slice(0, -4);
  return apiUrl.replace(/\/$/, "");
}

export function createSocketClient(jwt: string, path = "/socket.io"): Socket {
  const baseUrl = getSocketBaseUrl(env.API_URL);
  return io(baseUrl, {
    path,
    auth: { token: jwt },
    transports: ["websocket"],
  });
}

