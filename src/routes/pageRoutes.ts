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
router.get("/informacoes", (req, res) => res.render("imformacoes"));
router.get("/perfil", (req, res) => {
    // Mock de usuário para a página de perfil
    const usuario = {
        nome: "Administrador",
        email: "admin@academiaem.com",
        tipo: "Instrutor"
    };
    res.render("perfil", { usuario });
});

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

router.get("/alunos/editar/:id", (req, res) => {
    const aluno = alunoRepo.buscar(req.params.id);
    if (!aluno) return res.redirect("/alunos");
    res.render("aluno-form", { aluno });
});

router.post("/alunos/salvar", (req, res) => {
    const { id, nome, email, telefone, faixa } = req.body;

    if (id) {
        alunoRepo.atualizar(id, nome, email, telefone, faixa);
        emitUpdate("aluno_updated", { nome });
    } else {
        alunoRepo.criar(nome, email, telefone, faixa);
        emitUpdate("aluno_created", { nome });
    }

    res.redirect("/alunos");
});

router.get("/alunos/excluir/:id", (req, res) => {
    alunoRepo.remover(req.params.id);
    emitUpdate("aluno_deleted", { id: req.params.id });
    res.redirect("/alunos");
});

// --- GESTÃO DE TREINOS ---

router.get("/treinos", (req, res) => {
    const treinos = treinoRepo.listar();
    res.render("treinos", { treinos });
});

router.get("/treinos/novo", (req, res) => {
    res.render("treino-form", { treino: null });
});

router.get("/treinos/editar/:id", (req, res) => {
    const treino = treinoRepo.buscarPorId(req.params.id);
    if (!treino) return res.redirect("/treinos");
    res.render("treino-form", { treino });
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

router.get("/treinos/excluir/:id", (req, res) => {
    treinoRepo.remover(req.params.id);
    emitUpdate("treino_deleted", { id: req.params.id });
    res.redirect("/treinos");
});

// --- GESTÃO DE EXERCÍCIOS ---

router.get("/exercicios", (req, res) => {
    const exercicios = exercicioRepo.listar();
    res.render("exercícios", { exercicios });
});

router.get("/exercicios/novo", (req, res) => {
    res.render("exercício-form", { exercicio: null });
});

router.get("/exercicios/editar/:id", (req, res) => {
    const exercicio = exercicioRepo.buscarPorId(req.params.id);
    if (!exercicio) return res.redirect("/exercicios");
    res.render("exercício-form", { exercicio });
});

router.post("/exercicios/salvar", (req, res) => {
    const { id, nome, grupoMuscular, series, repeticoes } = req.body;

    if (id) {
        exercicioRepo.atualizar(id, nome, grupoMuscular, Number(series), Number(repeticoes));
        emitUpdate("exercicio_updated", { nome });
    } else {
        exercicioRepo.criar(nome, grupoMuscular, Number(series), Number(repeticoes));
        emitUpdate("exercicio_created", { nome });
    }

    res.redirect("/exercicios");
});

router.get("/exercicios/excluir/:id", (req, res) => {
    exercicioRepo.remover(req.params.id);
    emitUpdate("exercicio_deleted", { id: req.params.id });
    res.redirect("/exercicios");
});

export default router;