function confirmarExclusao(id, nome) {
var confirmado = window.confirm(
 'Tem certeza que deseja excluir o aluno "' + nome + '"? Esta ação não pode ser desfeita.'
);
if (confirmado) {
 var inputId = document.getElementById('input-id-exclusao');
 var formulario = document.getElementById('form-exclusao-aluno');
if (inputId && formulario) {
 inputId.value = id;
 formulario.submit();
  }
 }
}

document.addEventListener('DOMContentLoaded', function () {
 var linhas = document.querySelectorAll('.tabela-alunos tbody tr');
  linhas.forEach(function (linha) {
    linha.addEventListener('click', function (evento) {
        var alvo = evento.target;
        var ehBotaoOuLink = alvo.closest('a, button');
        if (!ehBotaoOuLink) {
        var id = linha.getAttribute('data-id');
        if (id) {
        window.location.href = '/alunos/editar/' + id;
            }
        }
    });
  });
});