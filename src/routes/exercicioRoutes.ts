import { Router } from "express";
import { ExercicioRepository } from "../models/ExercicioRepository";

const router = Router();
const repository = new ExercicioRepository();

router.get("/", (req, res) => {
  res.json(repository.listar());
});

router.get("/:id", (req, res) => {
  const exercicio = repository.buscarPorId(req.params.id);

  if (!exercicio) {
    return res.status(404).json({
      mensagem: "Exercício não encontrado"
    });
  }

  res.json(exercicio);
});

router.post("/", (req, res) => {
  const { nome, grupoMuscular, series, repeticoes } = req.body;

  const exercicio = repository.criar(
    nome,
    grupoMuscular,
    Number(series),
    Number(repeticoes)
  );

  res.status(201).json(exercicio);
});

router.delete("/:id", (req, res) => {
  const removido = repository.remover(req.params.id);

  if (!removido) {
    return res.status(404).json({
      mensagem: "Exercício não encontrado"
    });
  }

  res.json({
    mensagem: "Exercício removido"
  });
});

export default router;