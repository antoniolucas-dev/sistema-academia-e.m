import 'express-session';

declare module 'express-session' {
  interface SessionData {
    usuario?: any; // ou o tipo do seu usuário, ex: { id: number; nome: string; ... }
  }
}
