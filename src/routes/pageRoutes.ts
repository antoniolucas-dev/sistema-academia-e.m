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
function montarHistoricoDoAluno(alunoId: string, metaMensal?: number) {
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

    // Meses ativos: quantos meses distintos com pelo menos 1 treino concluído
    const mesesAtivos = new Set(
        historico.map(item => {
            const d = new Date(item.data);
            return `${d.getFullYear()}-${d.getMonth()}`;
        })
    );

    // Gráfico de evolução mensal: últimos 6 meses
    const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const graficoMeses: { mes: string; quantidade: number }[] = [];
    const agora2 = new Date();
    for (let i = 5; i >= 0; i--) {
        const dataRef = new Date(agora2.getFullYear(), agora2.getMonth() - i, 1);
        const ano = dataRef.getFullYear();
        const mes = dataRef.getMonth();
        const qtde = historico.filter(item => {
            const d = new Date(item.data);
            return d.getMonth() === mes && d.getFullYear() === ano;
        }).length;
        graficoMeses.push({ mes: nomesMeses[mes], quantidade: qtde });
    }

    return {
        historico,
        stats: {
            total: historico.length,
            esteMes: concluidosEsteMes,
            sequenciaAtual,
            totalMesesAtivos: mesesAtivos.size,
            metaMensal: metaMensal || 12
        },
        graficoMeses
    };
}

// Monta a grade de frequência dos últimos 7 dias (hoje incluso) de um aluno
function montarFrequenciaSemana(alunoId: string) {
    const diasComTreino = new Set(
        conclusaoRepo.listarPorAluno(alunoId).map(c => new Date(c.data).toISOString().slice(0, 10))
    );
    const nomesDias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    const dias = [];
    for (let i = 6; i >= 0; i--) {
        const data = new Date();
        data.setDate(data.getDate() - i);
        const iso = data.toISOString().slice(0, 10);
        dias.push({
            label: nomesDias[data.getDay()],
            treinou: diasComTreino.has(iso),
            hoje: i === 0
        });
    }
    return dias;
}

// Saudação de acordo com o horário atual
function montarSaudacao(): string {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
}

// Treino que o aluno mais concluiu ao longo do tempo
function montarTreinoFavorito(alunoId: string): { nome: string; vezes: number } | null {
    const conclusoes = conclusaoRepo.listarPorAluno(alunoId);
    if (conclusoes.length === 0) return null;

    const contagem = new Map<string, number>();
    conclusoes.forEach(c => contagem.set(c.treinoId, (contagem.get(c.treinoId) || 0) + 1));

    let treinoIdFavorito = "";
    let maiorContagem = 0;
    contagem.forEach((vezes, treinoId) => {
        if (vezes > maiorContagem) {
            maiorContagem = vezes;
            treinoIdFavorito = treinoId;
        }
    });

    const treino = treinoRepo.buscarPorId(treinoIdFavorito);
    return treino ? { nome: treino.nome, vezes: maiorContagem } : null;
}

// Último treino concluído pelo aluno
function montarUltimoTreino(alunoId: string): { treino: any; aindaAtribuido: boolean; jaConcluidoAgora: boolean } | null {
    const conclusoes = conclusaoRepo.listarPorAluno(alunoId).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    const ultima = conclusoes[0];
    if (!ultima) return null;

    const treino = treinoRepo.buscarPorId(ultima.treinoId);
    if (!treino) return null;

    return {
        treino,
        aindaAtribuido: (treino.alunosIds || []).includes(alunoId),
        jaConcluidoAgora: true
    };
}

// Agrupa treinos pendentes por categoria
function agruparPorCategoria(treinos: any[]): { categoria: string; quantidade: number }[] {
    const contagem = new Map<string, number>();
    treinos.forEach(t => contagem.set(t.categoria, (contagem.get(t.categoria) || 0) + 1));
    return Array.from(contagem.entries()).map(([categoria, quantidade]) => ({ categoria, quantidade }));
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
router.get("/dashboard", somenteLogado, (req, res) => {
    const usuario = req.session.usuario!;
    const saudacao = montarSaudacao();

    if (usuario.tipo !== "Aluno") {
        return res.render("dashboard", {
            saudacao, meuAluno: null, proximoTreino: null, outrosPendentes: [],
            frequenciaSemana: [], treinoFavorito: null, ultimoTreino: null, pendentesPorCategoria: []
        });
    }

    const meuAluno = alunoRepo.buscarPorUsuarioId(usuario.id) || null;

    let proximoTreino: any = null;
    let outrosPendentes: any[] = [];
    let pendentesPorCategoria: { categoria: string; quantidade: number }[] = [];
    let frequenciaSemana: any[] = [];
    let treinoFavorito: { nome: string; vezes: number } | null = null;
    let ultimoTreino: { treino: any; aindaAtribuido: boolean; jaConcluidoAgora: boolean } | null = null;

    if (meuAluno) {
        const todosTreinos = treinoRepo.listar();
        const atribuidos = todosTreinos.filter(t => (t.alunosIds || []).includes(meuAluno.id));
        const concluidoIds = conclusaoRepo.listarPorAluno(meuAluno.id).map(c => c.treinoId);
        const pendentes = atribuidos.filter(t => !concluidoIds.includes(t.id));

        proximoTreino = pendentes[0] || null;
        outrosPendentes = pendentes.slice(1);
        pendentesPorCategoria = agruparPorCategoria(pendentes);

        frequenciaSemana = montarFrequenciaSemana(meuAluno.id);
        treinoFavorito = montarTreinoFavorito(meuAluno.id);
        ultimoTreino = montarUltimoTreino(meuAluno.id);
    }

    res.render("dashboard", {
        saudacao, meuAluno, proximoTreino, outrosPendentes, pendentesPorCategoria,
        frequenciaSemana, treinoFavorito, ultimoTreino
    });
});
router.get("/informacoes", (req, res) => res.render("imformacoes"));
router.get("/perfil", somenteLogado, (req, res) => {
    const usuario = req.session.usuario!;
    const meuAluno = usuario.tipo === "Aluno" ? alunoRepo.buscarPorUsuarioId(usuario.id) : null;

    const { historico, stats, graficoMeses } = meuAluno
        ? montarHistoricoDoAluno(meuAluno.id, usuario.metaMensal)
        : { historico: [], stats: { total: 0, esteMes: 0, sequenciaAtual: 0, totalMesesAtivos: 0, metaMensal: usuario.metaMensal || 0 }, graficoMeses: [] };

    // Buscar treinos atribuídos ao aluno (com status de conclusão)
    let treinosAtribuidos: any[] = [];
    let treinConcluidoIds: string[] = [];

    if (meuAluno) {
        const todosTreinos = treinoRepo.listar();
        treinosAtribuidos = todosTreinos.filter(t => (t.alunosIds || []).includes(meuAluno!.id));
        treinConcluidoIds = conclusaoRepo.listarPorAluno(meuAluno.id).map(c => c.treinoId);
    }

    res.render("perfil", { usuario, meuAluno, historico, stats, graficoMeses: JSON.stringify(graficoMeses), treinosAtribuidos, treinConcluidoIds });
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
        const { nome, telefone, metaMensal } = req.body;
        const foto = req.file ? "/uploads/perfil/" + req.file.filename : undefined;

        // Converte a meta mensal para número, se fornecida
        const novaMeta = metaMensal !== undefined && metaMensal !== "" ? parseInt(metaMensal, 10) : undefined;

        const usuarioAtualizado = usuarioRepo.atualizarPerfil(usuarioLogado.id, nome, telefone, foto, novaMeta);

        if (usuarioAtualizado) {
            // Mantém a sessão sincronizada com os novos dados (sem a senha)
            req.session.usuario = {
                id: usuarioAtualizado.id,
                nome: usuarioAtualizado.nome,
                email: usuarioAtualizado.email,
                tipo: usuarioAtualizado.tipo,
                telefone: usuarioAtualizado.telefone,
                foto: usuarioAtualizado.foto,
                metaMensal: usuarioAtualizado.metaMensal || 12
            };
        }

        res.redirect("/perfil");
    });
});

// API para o Dashboard atualizar os números em tempo real (só Prof/Admin usam essa visão)
router.get("/api/stats", somenteGestor, (req, res) => {
    res.json({
        totalAlunos: alunoRepo.listar().length,
        totalTreinos: treinoRepo.listar().length,
        totalExercicios: exercicioRepo.listar().length
    });
});

// --- GESTÃO DE ALUNOS ---

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

    const usuarioVinculado = aluno.usuarioId ? usuarioRepo.buscarPorId(aluno.usuarioId) : undefined;

    const { historico, stats } = montarHistoricoDoAluno(aluno.id, usuarioVinculado?.metaMensal);

    res.render("historico", { aluno, historico, stats });
});

// --- GESTÃO DE TREINOS ---

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

    res.redirect(req.query.voltar === "dashboard" ? "/dashboard" : "/treinos");
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

    res.redirect(req.query.voltar === "dashboard" ? "/dashboard" : "/treinos");
});

router.get("/treinos/repetir/:id", somenteLogado, (req, res) => {
    const usuario = req.session.usuario!;
    const treinoId = String(req.params.id);

    if (usuario.tipo === "Aluno") {
        const meuAluno = alunoRepo.buscarPorUsuarioId(usuario.id);
        if (meuAluno) {
            conclusaoRepo.marcar(treinoId, meuAluno.id);
        }
    }

    res.redirect("/dashboard");
});

router.get("/treinos/novo", somenteGestor, (req, res) => {
    const alunos = alunoRepo.listar();
    res.render("treino-form", { treino: null, alunos });
});

router.get("/treinos/editar/:id", somenteGestor, (req, res) => {
    const treino = treinoRepo.buscarPorId(String(req.params.id));
    if (!treino) return res.redirect("/treinos");
    const alunos = alunoRepo.listar();
    res.render("treino-form", { treino, alunos });
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
    // Remove todas as conclusões deste treino
    const conclusoes = conclusaoRepo.listar();
    const novasConclusoes = conclusoes.filter(c => c.treinoId !== id);
    const { salvarArquivo } = require("../utils/jsonHelper");
    salvarArquivo("dados/conclusoes.json", novasConclusoes);
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
    } else {
        exercicioRepo.criar(nome, grupoMuscular, Number(series), Number(repeticoes));
    }

    res.redirect("/exercicios");
});

router.get("/exercicios/excluir/:id", somenteGestor, (req, res) => {
    const id = String(req.params.id);
    exercicioRepo.remover(id);
    res.redirect("/exercicios");
});

export default router;