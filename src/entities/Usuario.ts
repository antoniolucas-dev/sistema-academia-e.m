export type TipoUsuario = "Administrador" | "Professor" | "Aluno";

export default class Usuario{
    constructor(
        public id:string,
        public nome:string,
        public email:string,
        public senha:string,
        public tipo:TipoUsuario = "Aluno",
        public telefone:string = "",
        public foto:string = "",
        public metaMensal:number = 12
    ){}

}