import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (server: HttpServer ) => {
  io = new Server(server);
  return io;
};

export const emitUpdate = (event: string, data: any) => {
  if (io) io.emit("dashboard_update", { event, data });
};