export interface TreinoExercicio {
  exercicioId: string; // referencia um Exercicio do catálogo
  series: number;
  repeticoes: number;
}

export default interface Treino {
  id: string;
  nome: string;
  categoria: string;
  duracao: number;
  descricao: string;
  alunosIds?: string[]; // ids de Aluno (matriculados) para quem este treino foi atribuído; vazio/ausente = nenhum aluno específico
  exercicios?: TreinoExercicio[]; // exercícios do catálogo que compõem este treino, com séries/repetições específicas
}