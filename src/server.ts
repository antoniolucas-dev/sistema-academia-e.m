import http from "http";
import app from "./app";
import { initSocket } from "./socket";

const server = http.createServer(app   );
initSocket(server); // Inicializa o tempo real

server.listen(3000, () => {
    console.log(`Servidor iniciado em http://localhost:3000`   );
});