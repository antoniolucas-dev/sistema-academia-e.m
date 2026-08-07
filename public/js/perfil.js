async function carregarPerfil(){
    const token = localStorage.getItem("token");
    const resposta = await fetch("/usuarios/perfil", {
        headers:{
            Authorization: token
        }
    });
    const usuario = await resposta.json();
    document.querySelector("#nome").value = usuario.nome;
    document.querySelector("#email").value = usuario.email;

}

async function atualizarPerfil(){
    const token = localStorage.getItem("token");
    await fetch("/usuarios/perfil",{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            Authorization:token
        },
        body:JSON.stringify({
            nome:document.querySelector("#nome").value
        })
    });
    alert("Perfil atualizado!");
}
carregarPerfil();