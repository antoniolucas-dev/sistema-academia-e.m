export class Aluno {
    id: string;
    nome: string;
    idade: number;
    modalidade: string;

    constructor(
        id: string,
        nome: string,
        idade: number,
        modalidade: string
    ) {
        this.id = id;
        this.nome = nome;
        this.idade = idade;
        this.modalidade = modalidade;
    }
}