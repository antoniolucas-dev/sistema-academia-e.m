import { Aluno } from "../entities/Aluno";
import { lerArquivo, salvarArquivo } from "../utils/jsonHelper";
import { gerarId } from "../utils/idGenerator";

const ARQUIVO = "dados/alunos.json";

export class AlunoRepository {
  listar(): Aluno[] {
    return lerArquivo(ARQUIVO);
  }

  criar(nome: string, email: string, telefone: string, faixa: string) {
    const aluno = new Aluno(
      gerarId(),
      nome,
      email,
      telefone,
      faixa
    );

    const alunos = this.listar();
    alunos.push(aluno);
    salvarArquivo(ARQUIVO, alunos);
    return aluno;
  }

  buscar(id: string) {
    return this.listar().find((aluno: Aluno) => aluno.id === id);
  }

  atualizar(id: string, nome: string, email: string, telefone: string, faixa: string) {
    const alunos = this.listar();
    const indice = alunos.findIndex((a: Aluno) => a.id === id);
    if (indice !== -1) {
      alunos[indice].nome = nome;
      alunos[indice].email = email;
      alunos[indice].telefone = telefone;
      alunos[indice].faixa = faixa;
      salvarArquivo(ARQUIVO, alunos);
      return true;
    }
    return false;
  }

  remover(id: string) {
    const alunos = this.listar();
    const novos = alunos.filter((a: Aluno) => a.id !== id);
    salvarArquivo(ARQUIVO, novos);
  }
}






