import { Router } from "express";
import { TreinoRepository } from "../models/TreinoRepository";

const router = Router();
const repository = new TreinoRepository();

router.get("/", (req, res) => {
  res.json(repository.listar());
});

router.get("/:id", (req, res) => {
  const treino = repository.buscarPorId(req.params.id);

  if (!treino) {
    return res.status(404).json({
      mensagem: "Treino não encontrado"
    });
  }

  res.json(treino);
});

router.post("/", (req, res) => {
  const { nome, alunoId, exercicios } = req.body;

  const treino = repository.criar(
    nome,
    alunoId,
    exercicios
  );

  res.status(201).json(treino);
});

router.delete("/:id", (req, res) => {
  const removido = repository.remover(req.params.id);

  if (!removido) {
    return res.status(404).json({
      mensagem: "Treino não encontrado"
    });
  }

  res.json({
    mensagem: "Treino removido"
  });
});

export default router;