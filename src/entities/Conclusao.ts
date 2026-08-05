export default interface Conclusao {
  id: string;
  treinoId: string;
  alunoId: string; // id de Aluno (matriculado), não de Usuario
  data: string; // ISO string do momento em que foi marcado como concluído
}