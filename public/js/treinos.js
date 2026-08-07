async function carregarTreinos(){
    const token = localStorage.getItem("token");
    const resposta = await fetch("/treinos",{
        headers:{
            Authorization:token
        }
    });

    const treinos = await resposta.json();
    const lista = document.querySelector("#listaTreinos");
    if(!lista) return;
    lista.innerHTML="";
    treinos.forEach(treino=>{
        const item=document.createElement("li");
        item.innerHTML=`
        <h3>${treino.nome}</h3>
        <p>${treino.descricao}</p>
        `;
        lista.appendChild(item);
    });
}
carregarTreinos();