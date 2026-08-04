import { Router } from "express";
import { UsuarioRepository } from "../models/UsuarioRepository";
import { validarEmail, validarSenha, validarNome, validarTipo } from "../utils/validators";
import { TipoUsuario } from "../entities/Usuario";

const router = Router();
const repository = new UsuarioRepository();

router.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const querJson = (req.headers.accept || "").includes("application/json");

  const usuario = repository.buscarPorEmail(email);

  if (!usuario) {
    if (querJson) {
      return res.status(401).json({ mensagem: "Usuário não encontrado" });
    }
    return res.redirect("/login?erro=" + encodeURIComponent("Usuário não encontrado"));
  }

  if (usuario.senha !== senha) {
    if (querJson) {
      return res.status(401).json({ mensagem: "Senha inválida" });
    }
    return res.redirect("/login?erro=" + encodeURIComponent("Senha inválida"));
  }

  // Guarda o usuário autenticado na sessão (sem a senha)
  const { senha: _senha, ...usuarioSemSenha } = usuario;
  req.session.usuario = usuarioSemSenha;

  if (querJson) {
    return res.json({
      mensagem: "Login realizado com sucesso",
      token: "token-teste",
      usuario
    });
  }

  res.redirect("/dashboard");
});

router.post("/register", (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  const querJson = (req.headers.accept || "").includes("application/json");

  const erro = !validarNome(nome)
    ? "Nome inválido"
    : !validarEmail(email)
    ? "E-mail inválido"
    : !validarSenha(senha)
    ? "Senha deve ter pelo menos 6 caracteres"
    : !validarTipo(tipo)
    ? "Tipo de conta inválido"
    : repository.buscarPorEmail(email)
    ? "E-mail já cadastrado"
    : null;

  if (erro) {
    if (querJson) {
      return res.status(400).json({ mensagem: erro });
    }
    return res.redirect("/cadastro?erro=" + encodeURIComponent(erro));
  }

  const usuario = repository.criar(nome, email, senha, tipo as TipoUsuario);

  if (querJson) {
    return res.status(201).json(usuario);
  }

  res.redirect("/login?sucesso=" + encodeURIComponent("Conta criada com sucesso! Faça login."));
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;