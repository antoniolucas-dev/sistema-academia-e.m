import Conclusao from "../entities/Conclusao";
import { lerArquivo, salvarArquivo } from "../utils/jsonHelper";
import { gerarId } from "../utils/idGenerator";

const ARQUIVO = "dados/conclusoes.json";

export class ConclusaoRepository {
  listar(): Conclusao[] {
    return lerArquivo(ARQUIVO);
  }

  listarPorAluno(alunoId: string): Conclusao[] {
    return this.listar().filter(c => c.alunoId === alunoId);
  }

  listarPorTreino(treinoId: string): Conclusao[] {
    return this.listar().filter(c => c.treinoId === treinoId);
  }

  buscar(treinoId: string, alunoId: string): Conclusao | undefined {
    return this.listar().find(c => c.treinoId === treinoId && c.alunoId === alunoId);
  }

  marcar(treinoId: string, alunoId: string): Conclusao {
    const existente = this.buscar(treinoId, alunoId);
    if (existente) return existente; // já concluído, não duplica

    const nova: Conclusao = {
      id: gerarId(),
      treinoId,
      alunoId,
      data: new Date().toISOString()
    };

    const conclusoes = this.listar();
    conclusoes.push(nova);
    salvarArquivo(ARQUIVO, conclusoes);
    return nova;
  }

  desmarcar(treinoId: string, alunoId: string): boolean {
    const conclusoes = this.listar();
    const novos = conclusoes.filter(c => !(c.treinoId === treinoId && c.alunoId === alunoId));
    if (novos.length !== conclusoes.length) {
      salvarArquivo(ARQUIVO, novos);
      return true;
    }
    return false;
  }
}