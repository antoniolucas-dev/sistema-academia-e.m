export class Aluno {
  public id: string;
  public nome: string;
  public email: string;
  public telefone: string;
  public faixa: string;

  constructor(id: string, nome: string, email: string, telefone: string, faixa: string) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.faixa = faixa;
  }
}  

