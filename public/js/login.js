const formLogin = document.querySelector("#formLogin");
if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.querySelector("#email").value;
        const senha = document.querySelector("#senha").value;
        try {
            const resposta = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    senha
                })
            });
            const dados = await resposta.json();
            if (!resposta.ok) {
                alert(dados.mensagem || "Erro ao fazer login");
                return;
            }
            localStorage.setItem("token", dados.token);
            window.location.href = "/home";
        } catch (erro) {
            console.error(erro);
            alert("Erro no servidor");
        }
    });
}