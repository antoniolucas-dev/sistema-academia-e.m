import Treino from "../entities/Treino";
export class TreinoRepository {
  private treinos: Treino[] = [];

  listar(): Treino[] {
    return this.treinos;
  }

  buscarPorId(id: string): Treino | undefined {
    return this.treinos.find(treino => treino.id === id);
  }

  criar(nome: string, alunoId: string, exercicios: string[]): Treino {
    const novoTreino: Treino = {
        id: Date.now().toString(),
        nome,
        alunoId,
        exercicios
      };
    this.treinos.push(novoTreino);
    return novoTreino;
  }

  remover(id: string): boolean {
    const indice = this.treinos.findIndex(treino => treino.id === id);

    if (indice === -1) {
      return false;
    }

    this.treinos.splice(indice, 1);
    return true;
  }
}