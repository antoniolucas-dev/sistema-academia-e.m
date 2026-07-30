export class Aluno {
    public id: string;
    public nome: string;
    public idade: number;
    public modalidade: string;
  
    constructor(id: string, nome: string, idade: number, modalidade: string) {
      this.id = id;
      this.nome = nome;
      this.idade = idade;
      this.modalidade = modalidade;
    }
  }