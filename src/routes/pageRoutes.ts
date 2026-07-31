import { Router } from "express";
import { emitUpdate } from "../socket";

const router = Router();

// Página inicial
router.get("/", (req, res) => {
    res.render("index");
});

// Página de alunos
router.get("/alunos", (req, res) => {
    res.render("alunos");
});

// Salvar aluno
router.post("/alunos/salvar", (req, res) => {
    // ... lógica de salvar ...

    emitUpdate("aluno_created", {
        nome: req.body.nome
    });

    res.redirect("/alunos");
});

export default router;