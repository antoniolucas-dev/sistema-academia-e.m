import { Request, Response, NextFunction } from "express";

export function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      mensagem: "Usuário não autenticado"
    });
  }
  next();
}

// --- Middlewares baseados na sessão (usados nas páginas EJS) ---

// Bloqueia quem não está logado
export function somenteLogado(req: Request, res: Response, next: NextFunction) {
  if (!req.session.usuario) {
    return res.redirect("/login?erro=" + encodeURIComponent("Faça login para continuar"));
  }
  next();
}

// Bloqueia quem não é Professor ou Administrador
export function somenteGestor(req: Request, res: Response, next: NextFunction) {
  const usuario = req.session.usuario;

  if (!usuario) {
    return res.redirect("/login?erro=" + encodeURIComponent("Faça login para continuar"));
  }

  if (usuario.tipo !== "Administrador" && usuario.tipo !== "Professor") {
    return res.status(403).render("erro", {
      mensagem: "Você não tem permissão para acessar essa área."
    });
  }

  next();
}