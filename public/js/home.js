const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "/login";
}

async function carregarUsuario() {

    try {

        const resposta = await fetch("/usuarios/perfil", {
            headers: {
                Authorization: token
            }
        });

        const usuario = await resposta.json();

        const nome = document.querySelector("#nomeUsuario");

        if(nome){
            nome.textContent = usuario.nome;
        }

    } catch(error){
        console.error(error);
    }

}

carregarUsuario();