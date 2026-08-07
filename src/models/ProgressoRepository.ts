import Progresso from "../entities/Progresso";
import { lerArquivo, salvarArquivo } from "../utils/jsonHelper";
import { gerarId } from "../utils/idGenerator";

const ARQUIVO = "dados/progressos.json";

export class ProgressoRepository {
  listar(): Progresso[] {
    return lerArquivo(ARQUIVO);
  }
  buscar(treinoId: string, alunoId: string): Progresso | undefined {
    return this.listar().find(p => p.treinoId === treinoId && p.alunoId === alunoId);
  }

  // Garante que existe um registro de progresso pra esse treino+aluno, criando vazio se não existir
  private garantir(treinoId: string, alunoId: string): Progresso {
    const existente = this.buscar(treinoId, alunoId);
    if (existente) return existente;

    const novo: Progresso = {
      id: gerarId(),
      treinoId,
      alunoId,
      exerciciosConcluidosIds: []
    };

    const progressos = this.listar();
    progressos.push(novo);
    salvarArquivo(ARQUIVO, progressos);
    return novo;
  }

  marcarExercicio(treinoId: string, alunoId: string, exercicioId: string): Progresso {
    this.garantir(treinoId, alunoId);
    const progressos = this.listar();
    const indice = progressos.findIndex(p => p.treinoId === treinoId && p.alunoId === alunoId);

    if (!progressos[indice].exerciciosConcluidosIds.includes(exercicioId)) {
      progressos[indice].exerciciosConcluidosIds.push(exercicioId);
      salvarArquivo(ARQUIVO, progressos);
    }

    return progressos[indice];
  }

  desmarcarExercicio(treinoId: string, alunoId: string, exercicioId: string): Progresso {
    this.garantir(treinoId, alunoId);
    const progressos = this.listar();
    const indice = progressos.findIndex(p => p.treinoId === treinoId && p.alunoId === alunoId);

    progressos[indice].exerciciosConcluidosIds = progressos[indice].exerciciosConcluidosIds.filter(
      id => id !== exercicioId
    );
    salvarArquivo(ARQUIVO, progressos);

    return progressos[indice];
  }

  // Remove todo o progresso de um treino (ex: quando o treino é excluído, ou pra "reiniciar")
  removerPorTreino(treinoId: string): boolean {
    const progressos = this.listar();
    const novos = progressos.filter(p => p.treinoId !== treinoId);
    if (novos.length !== progressos.length) {
      salvarArquivo(ARQUIVO, novos);
      return true;
    }
    return false;
  }
}