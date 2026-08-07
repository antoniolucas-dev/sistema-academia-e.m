import Exercicio from "../entities/Exercicio";
import { lerArquivo, salvarArquivo } from "../utils/jsonHelper";
import { gerarId } from "../utils/idGenerator";

const ARQUIVO = "dados/exercicios.json";
export class ExercicioRepository {
  listar(): Exercicio[] {
    return lerArquivo(ARQUIVO);
  }
  buscarPorId(id: string): Exercicio | undefined {
    return this.listar().find(exercicio => exercicio.id === id);
  }

  criar(nome: string, grupoMuscular: string, series: number, repeticoes: number): Exercicio {
    const novoExercicio: Exercicio = {
      id: gerarId(),
      nome,
      grupoMuscular,
      series,
      repeticoes
    };
    const exercicios = this.listar();
    exercicios.push(novoExercicio);
    salvarArquivo(ARQUIVO, exercicios);
    return novoExercicio;
  }

  atualizar(id: string, nome: string, grupoMuscular: string, series: number, repeticoes: number): boolean {
    const exercicios = this.listar();
    const indice = exercicios.findIndex(e => e.id === id);
    if (indice !== -1) {
      exercicios[indice] = { id, nome, grupoMuscular, series, repeticoes };
      salvarArquivo(ARQUIVO, exercicios);
      return true;
    }
    return false;
  }

  remover(id: string): boolean {
    const exercicios = this.listar();
    const novos = exercicios.filter(exercicio => exercicio.id !== id);
    if (exercicios.length !== novos.length) {
      salvarArquivo(ARQUIVO, novos);
      return true;
    }
    return false;
  }
}

