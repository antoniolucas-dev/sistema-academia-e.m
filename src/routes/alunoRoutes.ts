import { Router } from "express";
import { AlunoRepository } from "../models/AlunoRepository";

const router = Router();

const repo = new AlunoRepository();

router.get("/", (req, res) => {
  res.json(repo.listar());
});

router.post("/", (req, res) => {
  const { nome, idade, modalidade } = req.body;

  const aluno = repo.criar(nome, idade, modalidade);

  res.json(aluno);
});

router.delete("/:id", (req, res) => {
  repo.remover(req.params.id);

  res.json({
    mensagem: "Aluno removido"
  });
});

export default router;




