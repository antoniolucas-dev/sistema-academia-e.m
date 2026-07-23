import fs from "fs";


export function lerArquivo(caminho:string){

    if(!fs.existsSync(caminho)){
        return [];
    }


    const dados = fs.readFileSync(
        caminho,
        "utf-8"
    );


    return JSON.parse(dados);

}



export function salvarArquivo(
    caminho:string,
    dados:any
){

    fs.writeFileSync(
        caminho,
        JSON.stringify(
            dados,
            null,
            2
        )
    );

}


