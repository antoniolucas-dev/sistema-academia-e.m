import { Router } from "express";
import { AlunoRepository } from "../models/AlunoRepository";
import { TreinoRepository } from "../models/TreinoRepository";
import { ExercicioRepository } from "../models/ExercicioRepository";

const router = Router();
const alunoRepo = new AlunoRepository();
const treinoRepo = new TreinoRepository();
const exercicioRepo = new ExercicioRepository();

// Home & Auth
router.get("/", (req, res) => res.render("home"));
router.get("/login", (req, res) => res.render("login"));
router.get("/cadastro", (req, res) => res.render("cadastro"));
router.get("/dashboard", (req, res) => res.render("dashboard"));
router.get("/informações", (req, res) => res.render("imformações"));
router.get("/informacoes", (req, res) => res.render("imformações"));
router.get("/perfil", (req, res) => {
    const usuario = { nome: "Admin", email: "admin@academia.com", tipo: "Administrador" };
    res.render("perfil", { usuario });
});

// Alunos
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
    } else {
        alunoRepo.criar(nome, email, telefone, faixa);
    }
    res.redirect("/alunos");
});

router.get("/alunos/editar/:id", (req, res) => {
    const aluno = alunoRepo.buscar(req.params.id);
    res.render("aluno-form", { aluno });
});

router.get("/alunos/excluir/:id", (req, res) => {
    alunoRepo.remover(req.params.id);
    res.redirect("/alunos");
});

// Treinos
router.get("/treinos", (req, res) => {
    const treinos = treinoRepo.listar();
    res.render("treinos", { treinos });
});

router.get("/treinos/novo", (req, res) => {
    res.render("treino-form", { treino: null });
});

router.post("/treinos/salvar", (req, res) => {
    const { id, nome, categoria, duracao, descricao } = req.body;
    if (id) {
        treinoRepo.atualizar(id, nome, categoria, Number(duracao), descricao);
    } else {
        treinoRepo.criar(nome, categoria, Number(duracao), descricao);
    }
    res.redirect("/treinos");
});

router.get("/treinos/editar/:id", (req, res) => {
    const treino = treinoRepo.buscarPorId(req.params.id);
    res.render("treino-form", { treino });
});

router.get("/treinos/excluir/:id", (req, res) => {
    treinoRepo.remover(req.params.id);
    res.redirect("/treinos");
});

// Exercícios
router.get("/exercicios", (req, res) => {
    const exercicios = exercicioRepo.listar();
    res.render("exercícios", { exercicios });
});

router.get("/exercicios/novo", (req, res) => {
    res.render("exercício-form", { exercicio: null });
});

router.post("/exercicios/salvar", (req, res) => {
    const { id, nome, grupoMuscular, series, repeticoes } = req.body;
    if (id) {
        exercicioRepo.atualizar(id, nome, grupoMuscular, Number(series), Number(repeticoes));
    } else {
        exercicioRepo.criar(nome, grupoMuscular, Number(series), Number(repeticoes));
    }
    res.redirect("/exercicios");
});

router.get("/exercicios/editar/:id", (req, res) => {
    const exercicio = exercicioRepo.buscarPorId(req.params.id);
    res.render("exercício-form", { exercicio });
});

router.get("/exercicios/excluir/:id", (req, res) => {
    exercicioRepo.remover(req.params.id);
    res.redirect("/exercicios");
});

export default router;