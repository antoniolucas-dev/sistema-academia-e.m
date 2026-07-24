import {Aluno} from "../entities/Alunos";
import {lerArquivo,salvarArquivo} from "../utils/jsonHelper";
import {gerarId} from "../utils/idGenerator";


const ARQUIVO="dados/alunos.json";


export class AlunoRepository{


listar(){

    return lerArquivo(ARQUIVO);

}



criar(
    nome:string,
    idade:number,
    modalidade:string
){


const aluno = new Aluno(
    gerarId(),
    nome,
    idade,
    modalidade
);


const alunos=this.listar();


alunos.push(aluno);


salvarArquivo(
    ARQUIVO,
    alunos
);


return aluno;


}



buscar(id:string){

return this.listar()
.find(
(aluno:any)=>aluno.id===id
);


}



remover(id:string){


const alunos=this.listar();


const novos=alunos.filter(
(a:any)=>a.id!==id
);


salvarArquivo(
ARQUIVO,
novos
);


}



}
