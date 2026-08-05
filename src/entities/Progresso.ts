export default interface Progresso {
  id: string;
  treinoId: string;
  alunoId: string; // id de Aluno (matriculado), não de Usuario
  exerciciosConcluidosIds: string[]; // ids de Exercicio já marcados como feitos, dentro deste treino
}