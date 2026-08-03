import { Router } from "express";
import { AlunoRepository } from "../models/AlunoRepository";
import { TreinoRepository } from "../models/TreinoRepository";
import { ExercicioRepository } from "../models/ExercicioRepository";
import { emitUpdate } from "../socket";

const router = Router();
const alunoRepo = new AlunoRepository();
const treinoRepo = new TreinoRepository();
const exercicioRepo = new ExercicioRepository();

// --- PÁGINAS PRINCIPAIS ---

router.get("/", (req, res) => res.render("index"));
router.get("/login", (req, res) => res.render("login"));
router.get("/dashboard", (req, res) => res.render("dashboard"));
router.get("/informacoes", (req, res) => res.render("informacoes"));

// API para o Dashboard atualizar os números em tempo real
router.get("/api/stats", (req, res) => {
    res.json({
        totalAlunos: alunoRepo.listar().length,
        totalTreinos: treinoRepo.listar().length,
        totalExercicios: exercicioRepo.listar().length
    });
});

// --- GESTÃO DE ALUNOS ---

router.get("/alunos", (req, res) => {
    const alunos = alunoRepo.listar();
    res.render("alunos", { alunos });
});

router.get("/alunos/novo", (req, res) => {
    res.render("aluno-form", { aluno: null });
});

router.post("/alunos/salvar", (req, res) => {
    const { id, nome, email, telefone, faixa } = req.body;
    
    if (id) {
        alunoRepo.atualizar(id, nome, email, telefone, faixa);
        emitUpdate("aluno_updated", { nome }); // Notifica tempo real
    } else {
        alunoRepo.criar(nome, email, telefone, faixa);
        emitUpdate("aluno_created", { nome }); // Notifica tempo real
    }
    
    res.redirect("/alunos");
});

router.get("/alunos/excluir/:id", (req, res) => {
    alunoRepo.remover(req.params.id);
    emitUpdate("aluno_deleted", { id: req.params.id }); // Notifica tempo real
    res.redirect("/alunos");
});

// --- GESTÃO DE TREINOS ---

router.get("/treinos", (req, res) => {
    const treinos = treinoRepo.listar();
    res.render("treinos", { treinos });
});

router.post("/treinos/salvar", (req, res) => {
    const { id, nome, categoria, duracao, descricao } = req.body;
    
    if (id) {
        treinoRepo.atualizar(id, nome, categoria, Number(duracao), descricao);
        emitUpdate("treino_updated", { nome });
    } else {
        treinoRepo.criar(nome, categoria, Number(duracao), descricao);
        emitUpdate("treino_created", { nome });
    }
    
    res.redirect("/treinos");
});

// ... Adicione as outras rotas de Exercícios seguindo o mesmo padrão ...

export default router;