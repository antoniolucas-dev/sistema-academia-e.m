export default interface Treino {
  id: string;
  nome: string;
  categoria: string;
  duracao: number;
  descricao: string;
  alunosIds?: string[]; // ids de Aluno (matriculados) para quem este treino foi atribuído; vazio/ausente = nenhum aluno específico
}