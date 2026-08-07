async function carregarExercicios(){
    const token = localStorage.getItem("token");
    const resposta = await fetch("/exercicios",{
        headers:{
            Authorization:token
        }

    });

    const exercicios = await resposta.json();
    const lista=document.querySelector("#listaExercicios");
    if(!lista)return;
    lista.innerHTML="";
    exercicios.forEach(exercicio=>{
        const item=document.createElement("li");
        item.innerHTML=`
        <strong>${exercicio.nome}</strong>
        <p>${exercicio.descricao}</p>
        `;
        lista.appendChild(item);
    });
}
carregarExercicios();