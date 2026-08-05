import Treino, { TreinoExercicio } from "../entities/Treino";
import { lerArquivo, salvarArquivo } from "../utils/jsonHelper";
import { gerarId } from "../utils/idGenerator";

const ARQUIVO = "dados/treinos.json";

export class TreinoRepository {
  listar(): Treino[] {
    return lerArquivo(ARQUIVO);
  }

  buscarPorId(id: string): Treino | undefined {
    return this.listar().find(treino => treino.id === id);
  }

  criar(
    nome: string,
    categoria: string,
    duracao: number,
    descricao: string,
    alunosIds: string[] = [],
    exercicios: TreinoExercicio[] = []
  ): Treino {
    const novoTreino: Treino = {
      id: gerarId(),
      nome,
      categoria,
      duracao,
      descricao,
      alunosIds,
      exercicios
    };

    const treinos = this.listar();
    treinos.push(novoTreino);
    salvarArquivo(ARQUIVO, treinos);
    return novoTreino;
  }

  atualizar(
    id: string,
    nome: string,
    categoria: string,
    duracao: number,
    descricao: string,
    alunosIds: string[] = [],
    exercicios: TreinoExercicio[] = []
  ): boolean {
    const treinos = this.listar();
    const indice = treinos.findIndex(t => t.id === id);
    if (indice !== -1) {
      treinos[indice] = { id, nome, categoria, duracao, descricao, alunosIds, exercicios };
      salvarArquivo(ARQUIVO, treinos);
      return true;
    }
    return false;
  }

  remover(id: string): boolean {
    const treinos = this.listar();
    const novos = treinos.filter(treino => treino.id !== id);
    if (treinos.length !== novos.length) {
      salvarArquivo(ARQUIVO, novos);
      return true;
    }
    return false;
  }
}

