import Exercicio  from "../entities/Exercicio";

export class ExercicioRepository {
  private exercicios: Exercicio[] = [];

  listar(): Exercicio[] {
    return this.exercicios;
  }

  buscarPorId(id: string): Exercicio | undefined {
    return this.exercicios.find(exercicio => exercicio.id === id);
  }

  criar(nome: string, grupoMuscular: string, series: number, repeticoes: number): Exercicio {
    const novoExercicio: Exercicio = {
        id: Date.now().toString(),
        nome,
        grupoMuscular,
        series,
        repeticoes
      };

    this.exercicios.push(novoExercicio);
    return novoExercicio;
  }

  remover(id: string): boolean {
    const indice = this.exercicios.findIndex(exercicio => exercicio.id === id);

    if (indice === -1) {
      return false;
    }

    this.exercicios.splice(indice, 1);
    return true;
  }
}