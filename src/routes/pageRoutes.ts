import { Router } from "express";
import { AlunoRepository } from "../models/AlunoRepository";
import { TreinoRepository } from "../models/TreinoRepository";
import { ExercicioRepository } from "../models/ExercicioRepository";
import { UsuarioRepository } from "../models/UsuarioRepository";
import { ConclusaoRepository } from "../models/ConclusaoRepository";
import { emitUpdate } from "../socket";
import { somenteLogado, somenteGestor } from "../middlewares/auth";
import uploadPerfil from "../middlewares/uploadPerfil";

const router = Router();
const alunoRepo = new AlunoRepository();
const treinoRepo = new TreinoRepository();
const exercicioRepo = new ExercicioRepository();
const usuarioRepo = new UsuarioRepository();
const conclusaoRepo = new ConclusaoRepository();

// Monta o histórico de treinos concluídos de um aluno, com dados do treino + estatísticas
function montarHistoricoDoAluno(alunoId: string) {
    const conclusoes = conclusaoRepo.listarPorAluno(alunoId);

    const historico = conclusoes
        .map(c => ({
            treino: treinoRepo.buscarPorId(c.treinoId),
            data: c.data
        }))
        .filter(item => item.treino) // ignora conclusões de treinos que já foram excluídos
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    const agora = new Date();
    const concluidosEsteMes = historico.filter(item => {
        const d = new Date(item.data);
        return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
    }).length;

    // Sequência atual: dias seguidos (contando hoje pra trás) com pelo menos 1 treino concluído
    const diasComTreino = new Set(
        historico.map(item => new Date(item.data).toISOString().slice(0, 10))
    );

    let sequenciaAtual = 0;
    const cursor = new Date();
    while (diasComTreino.has(cursor.toISOString().slice(0, 10))) {
        sequenciaAtual++;
        cursor.setDate(cursor.getDate() - 1);
    }

    return {
        historico,
        stats: { total: historico.length, esteMes: concluidosEsteMes, sequenciaAtual }
    };
}

// --- PÁGINAS PRINCIPAIS ---

router.get("/", (req, res) => res.render("index"));
router.get("/login", (req, res) => {
    res.render("login", {
        erro: req.query.erro || null,
        sucesso: req.query.sucesso || null
    });
});
router.get("/cadastro", (req, res) => {
    res.render("cadastro", {
        erro: req.query.erro || null
    });
});
router.get("/dashboard", somenteLogado, (req, res) => res.render("dashboard"));
router.get("/informacoes", (req, res) => res.render("imformacoes"));
router.get("/perfil", somenteLogado, (req, res) => {
    const usuario = req.session.usuario!;
    const meuAluno = usuario.tipo === "Aluno" ? alunoRepo.buscarPorUsuarioId(usuario.id) : null;

    const { historico, stats } = meuAluno
        ? montarHistoricoDoAluno(meuAluno.id)
        : { historico: [], stats: { total: 0, esteMes: 0, sequenciaAtual: 0 } };

    res.render("perfil", { usuario, meuAluno, historico, stats });
});

router.get("/perfil/editar", somenteLogado, (req, res) => {
    res.render("perfil-form", { usuario: req.session.usuario, erro: req.query.erro || null });
});

router.post("/perfil/salvar", somenteLogado, (req, res) => {
    uploadPerfil.single("foto")(req, res, (err) => {
        if (err) {
            return res.redirect("/perfil/editar?erro=" + encodeURIComponent(err.message));
        }

        const usuarioLogado = req.session.usuario!;
        const { nome, telefone } = req.body;
        const foto = req.file ? "/uploads/perfil/" + req.file.filename : undefined;

        const usuarioAtualizado = usuarioRepo.atualizarPerfil(usuarioLogado.id, nome, telefone, foto);

        if (usuarioAtualizado) {
            // Mantém a sessão sincronizada com os novos dados (sem a senha)
            req.session.usuario = {
                id: usuarioAtualizado.id,
                nome: usuarioAtualizado.nome,
                email: usuarioAtualizado.email,
                tipo: usuarioAtualizado.tipo,
                telefone: usuarioAtualizado.telefone,
                foto: usuarioAtualizado.foto
            };
        }

        res.redirect("/perfil");
    });
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

// Lista contas de login do tipo "Aluno" que ainda podem ser vinculadas a um cadastro de matrícula
// (exclui as que já estão vinculadas a outro aluno, mas mantém a que já pertence a `alunoAtualId`)
function contasDisponiveisParaVinculo(alunoAtualId?: string) {
    const alunos = alunoRepo.listar();
    const idsVinculados = new Set(
        alunos
            .filter(a => a.usuarioId && a.id !== alunoAtualId)
            .map(a => a.usuarioId)
    );

    return usuarioRepo
        .listar()
        .filter(u => u.tipo === "Aluno" && !idsVinculados.has(u.id));
}

router.get("/alunos", somenteGestor, (req, res) => {
    const alunos = alunoRepo.listar();
    res.render("alunos", { alunos });
});

router.get("/alunos/novo", somenteGestor, (req, res) => {
    res.render("aluno-form", { aluno: null, contas: contasDisponiveisParaVinculo() });
});

router.get("/alunos/editar/:id", somenteGestor, (req, res) => {
    const aluno = alunoRepo.buscar(String(req.params.id));
    if (!aluno) return res.redirect("/alunos");
    res.render("aluno-form", { aluno, contas: contasDisponiveisParaVinculo(aluno.id) });
});

router.post("/alunos/salvar", somenteGestor, (req, res) => {
    const { id, nome, email, telefone, faixa, usuarioId } = req.body;
    const vinculo = usuarioId || undefined;

    if (id) {
        alunoRepo.atualizar(id, nome, email, telefone, faixa, vinculo);
        emitUpdate("aluno_updated", { nome });
    } else {
        alunoRepo.criar(nome, email, telefone, faixa, vinculo);
        emitUpdate("aluno_created", { nome });
    }

    res.redirect("/alunos");
});

router.get("/alunos/excluir/:id", somenteGestor, (req, res) => {
    const id = String(req.params.id);
    alunoRepo.remover(id);
    emitUpdate("aluno_deleted", { id });
    res.redirect("/alunos");
});

router.get("/alunos/:id/historico", somenteGestor, (req, res) => {
    const aluno = alunoRepo.buscar(String(req.params.id));
    if (!aluno) return res.redirect("/alunos");

    const { historico, stats } = montarHistoricoDoAluno(aluno.id);

    res.render("historico", { aluno, historico, stats });
});

// --- GESTÃO DE TREINOS ---

// express.urlencoded envia checkbox[] como string (1 marcado), array (2+) ou undefined (nenhum) — isso normaliza pra array sempre
function normalizarLista(valor: unknown): string[] {
    if (!valor) return [];
    return Array.isArray(valor) ? valor.map(String) : [String(valor)];
}

router.get("/treinos", somenteLogado, (req, res) => {
    const usuario = req.session.usuario!;
    const todosTreinos = treinoRepo.listar();
    const alunos = alunoRepo.listar();

    let treinos = todosTreinos;
    let meuAluno = null;
    let concluidosIds: string[] = [];
    let totalConcluidosPorTreino: Record<string, number> = {};

    if (usuario.tipo === "Aluno") {
        meuAluno = alunoRepo.buscarPorUsuarioId(usuario.id) || null;
        treinos = meuAluno
            ? todosTreinos.filter(t => (t.alunosIds || []).includes(meuAluno!.id))
            : [];

        if (meuAluno) {
            concluidosIds = conclusaoRepo.listarPorAluno(meuAluno.id).map(c => c.treinoId);
        }
    } else {
        // Admin/Professor: quantos alunos já concluíram cada treino
        todosTreinos.forEach(t => {
            totalConcluidosPorTreino[t.id] = conclusaoRepo.listarPorTreino(t.id).length;
        });
    }

    res.render("treinos", { treinos, alunos, meuAluno, concluidosIds, totalConcluidosPorTreino });
});

router.get("/treinos/concluir/:id", somenteLogado, (req, res) => {
    const usuario = req.session.usuario!;
    const treinoId = String(req.params.id);

    if (usuario.tipo === "Aluno") {
        const meuAluno = alunoRepo.buscarPorUsuarioId(usuario.id);
        const treino = treinoRepo.buscarPorId(treinoId);
        const foiAtribuido = meuAluno && treino && (treino.alunosIds || []).includes(meuAluno.id);

        if (meuAluno && foiAtribuido) {
            conclusaoRepo.marcar(treinoId, meuAluno.id);
        }
    }

    res.redirect("/treinos");
});

router.get("/treinos/desmarcar/:id", somenteLogado, (req, res) => {
    const usuario = req.session.usuario!;
    const treinoId = String(req.params.id);

    if (usuario.tipo === "Aluno") {
        const meuAluno = alunoRepo.buscarPorUsuarioId(usuario.id);
        if (meuAluno) {
            conclusaoRepo.desmarcar(treinoId, meuAluno.id);
        }
    }

    res.redirect("/treinos");
});

router.get("/treinos/novo", somenteGestor, (req, res) => {
    res.render("treino-form", { treino: null, alunos: alunoRepo.listar() });
});

router.get("/treinos/editar/:id", somenteGestor, (req, res) => {
    const treino = treinoRepo.buscarPorId(String(req.params.id));
    if (!treino) return res.redirect("/treinos");
    res.render("treino-form", { treino, alunos: alunoRepo.listar() });
});

router.post("/treinos/salvar", somenteGestor, (req, res) => {
    const { id, nome, categoria, duracao, descricao } = req.body;
    const alunosIds = normalizarLista(req.body.alunosIds);

    if (id) {
        treinoRepo.atualizar(id, nome, categoria, Number(duracao), descricao, alunosIds);
        emitUpdate("treino_updated", { nome });
    } else {
        treinoRepo.criar(nome, categoria, Number(duracao), descricao, alunosIds);
        emitUpdate("treino_created", { nome });
    }

    res.redirect("/treinos");
});

router.get("/treinos/excluir/:id", somenteGestor, (req, res) => {
    const id = String(req.params.id);
    treinoRepo.remover(id);
    // remove também os registros de conclusão órfãos desse treino
    conclusaoRepo.listarPorTreino(id).forEach(c => conclusaoRepo.desmarcar(c.treinoId, c.alunoId));
    emitUpdate("treino_deleted", { id });
    res.redirect("/treinos");
});

// --- GESTÃO DE EXERCÍCIOS ---

router.get("/exercicios", somenteLogado, (req, res) => {
    const exercicios = exercicioRepo.listar();
    res.render("exercícios", { exercicios });
});

router.get("/exercicios/novo", somenteGestor, (req, res) => {
    res.render("exercício-form", { exercicio: null });
});

router.get("/exercicios/editar/:id", somenteGestor, (req, res) => {
    const exercicio = exercicioRepo.buscarPorId(String(req.params.id));
    if (!exercicio) return res.redirect("/exercicios");
    res.render("exercício-form", { exercicio });
});

router.post("/exercicios/salvar", somenteGestor, (req, res) => {
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

router.get("/exercicios/excluir/:id", somenteGestor, (req, res) => {
    const id = String(req.params.id);
    exercicioRepo.remover(id);
    emitUpdate("exercicio_deleted", { id });
    res.redirect("/exercicios");
});

export default router;