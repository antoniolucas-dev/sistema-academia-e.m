import "express-session";
import { TipoUsuario } from "../entities/Usuario";

declare module "express-session" {
  interface SessionData {
    usuario?: {
      id: string;
      nome: string;
      email: string;
      tipo: TipoUsuario;
      telefone: string;
      foto: string;
    };
  }
}