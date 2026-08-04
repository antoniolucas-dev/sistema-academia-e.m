import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export function initSocket(server: HttpServer  ) {
  io = new Server(server);
  io.on("connection", (socket) => {
    console.log("Cliente conectado ao WebSocket");
  });
}

export function emitUpdate(event: string, data: any) {
  if (io) {
    io.emit("dashboard_update", { event, data });
  }
}