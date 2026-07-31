import { Router } from "express";
import { emitUpdate } from "../socket";

const router = Router();

// Exemplo no POST de alunos
router.post("/alunos/salvar", (req, res) => {
    // ... lógica de salvar ...

    emitUpdate("aluno_created", {
        nome: req.body.nome
    });

    res.redirect("/alunos");
});

export default router;