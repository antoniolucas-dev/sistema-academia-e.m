export class Aluno {
  public id: string;
  public nome: string;
  public email: string;
  public telefone: string;
  public faixa: string;
  public usuarioId?: string; // vincula este aluno matriculado a uma conta de login (Usuario) do tipo "Aluno"

  constructor(id: string, nome: string, email: string, telefone: string, faixa: string, usuarioId?: string) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.faixa = faixa;
    this.usuarioId = usuarioId;
  }
}