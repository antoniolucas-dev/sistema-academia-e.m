import { Router } from "express";
import { UsuarioRepository } from "../models/UsuarioRepository";
import { validarEmail, validarSenha, validarNome } from "../utils/validators";

const router = Router();
const repository = new UsuarioRepository();

router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const usuario = repository.buscarPorEmail(email);

  if (!usuario) {
    return res.status(401).json({
      mensagem: "Usuário não encontrado"
    });
  }

  if (usuario.senha !== senha) {
    return res.status(401).json({
      mensagem: "Senha inválida"
    });
  }

  res.json({
    mensagem: "Login realizado com sucesso",
    token: "token-teste",
    usuario
  });
});

router.post("/register", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!validarNome(nome)) {
    return res.status(400).json({ mensagem: "Nome inválido" });
  }

  if (!validarEmail(email)) {
    return res.status(400).json({ mensagem: "E-mail inválido" });
  }

  if (!validarSenha(senha)) {
    return res.status(400).json({ mensagem: "Senha deve ter pelo menos 6 caracteres" });
  }

  if (repository.buscarPorEmail(email)) {
    return res.status(400).json({
      mensagem: "E-mail já cadastrado"
    });
  }

  const usuario = repository.criar(nome, email, senha);

  res.status(201).json(usuario);
});

export default router;