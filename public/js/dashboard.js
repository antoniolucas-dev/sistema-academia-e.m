document.addEventListener('DOMContentLoaded', function () {
    inicializarSaudacao();
    inicializarRelogio();
    animarContadoresEstatisticas();
    inicializarMenuMobile();
    inicializarGraficoMatriculas();
});


function inicializarSaudacao() {
    var elementoSaudacao = document.getElementById('saudacao-usuario');
    if (!elementoSaudacao) {
    return;
    }

    var nomeUsuario = elementoSaudacao.getAttribute('data-nome') || '';
    var horaAtual = new Date().getHours();
    var saudacao;

    if (horaAtual >= 5 && horaAtual < 12) {
        saudacao = 'Bom dia';
    } else if (horaAtual >= 12 && horaAtual < 18) {
        saudacao = 'Boa tarde';
    } else {
        saudacao = 'Boa noite';
    }

    var textoFinal = nomeUsuario ? saudacao + ', ' + nomeUsuario : saudacao;
    elementoSaudacao.textContent = textoFinal;
}

/**
 * Atualiza o relógio e a data em tempo real.
 * Espera elementos com id="relogio-atual" e id="data-atual".
 */
function inicializarRelogio() {
    var elementoRelogio = document.getElementById('relogio-atual');
    var elementoData = document.getElementById('data-atual');

    if (!elementoRelogio && !elementoData) {
        return;
    }

    function atualizar() {
        var agora = new Date();
        if (elementoRelogio) {
            var horas = String(agora.getHours()).padStart(2, '0');
            var minutos = String(agora.getMinutes()).padStart(2, '0');
            var segundos = String(agora.getSeconds()).padStart(2, '0');
            elementoRelogio.textContent = horas + ':' + minutos + ':' + segundos;
        }
        if (elementoData) {
            var opcoesFormato = {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            };
            var dataFormatada = agora.toLocaleDateString('pt-BR', opcoesFormato);
            elementoData.textContent = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
        }
    }

    atualizar();
    setInterval(atualizar, 1000);
}


function animarContadoresEstatisticas() {
    var elementosContador = document.querySelectorAll('.estatistica-valor[data-valor-final]');
    if (!elementosContador || elementosContador.length === 0) {
        return;
    }
    elementosContador.forEach(function (elemento) {
        var valorFinal = parseInt(elemento.getAttribute('data-valor-final'), 10);
        if (isNaN(valorFinal)) {
            return;
        }
        var valorAtual = 0;
        var duracaoMs = 1000;
        var incrementoPorFrame = valorFinal / (duracaoMs / 16);

        function proximoFrame() {
            valorAtual += incrementoPorFrame;
            if (valorAtual >= valorFinal) {
                elemento.textContent = valorFinal;
                return;
            }

            elemento.textContent = Math.floor(valorAtual);
            requestAnimationFrame(proximoFrame);
        }

        requestAnimationFrame(proximoFrame);
    });
}

/**
 * Controla a abertura e fechamento da sidebar em telas menores.
 * Espera um botão com id="btn-menu-mobile" e a sidebar com classe ".sidebar".
 */
function inicializarMenuMobile() {
    var botaoMenu = document.getElementById('btn-menu-mobile');
    var sidebar = document.querySelector('.sidebar');
    if (!botaoMenu || !sidebar) {
        return;
    }
    botaoMenu.addEventListener('click', function () {
        sidebar.classList.toggle('sidebar-aberta');
    });
    document.addEventListener('click', function (evento) {
        var cliqueForaDaSidebar = !sidebar.contains(evento.target);
        var cliqueForaDoBotao = !botaoMenu.contains(evento.target);
        if (cliqueForaDaSidebar && cliqueForaDoBotao) {
            sidebar.classList.remove('sidebar-aberta');
        }
    });
}

/**
 * Renderiza um gráfico de barras simples (Canvas API nativo) com o número
 * de matrículas por mês. Espera um elemento canvas com id="grafico-matriculas"
 * e um atributo data-grafico contendo um JSON no formato:
 * [{ "mes": "Jan", "total": 12 }, { "mes": "Fev", "total": 18 }, ...]
 */
function inicializarGraficoMatriculas() {
    var canvas = document.getElementById('grafico-matriculas');
    if (!canvas) {
        return;
    }
    var dadosBrutos = canvas.getAttribute('data-grafico');
    if (!dadosBrutos) {
        return;
    }
    var dados;
    try {
        dados = JSON.parse(dadosBrutos);
    } catch (erro) {
        console.error('Erro ao interpretar os dados do gráfico:', erro);
        return;
    }
    if (!Array.isArray(dados) || dados.length === 0) {
        return;
    }

    var contexto = canvas.getContext('2d');
    var larguraCanvas = canvas.width;
    var alturaCanvas = canvas.height;
    var margemInferior = 30;
    var margemSuperior = 20;
    var margemLateral = 10;

    var valorMaximo = Math.max.apply(null, dados.map(function (item) {
        return item.total;
    }));

    if (valorMaximo === 0) {
        valorMaximo = 1;
    }

    var larguraDisponivel = larguraCanvas - (margemLateral * 2);
    var larguraBarra = larguraDisponivel / dados.length * 0.6;
    var espacoEntreBarras = larguraDisponivel / dados.length;
    var alturaMaximaBarra = alturaCanvas - margemInferior - margemSuperior;

    contexto.clearRect(0, 0, larguraCanvas, alturaCanvas);

    dados.forEach(function (item, indice) {
        var alturaBarra = (item.total / valorMaximo) * alturaMaximaBarra;
        var posicaoX = margemLateral + (indice * espacoEntreBarras) + (espacoEntreBarras - larguraBarra) / 2;
        var posicaoY = alturaCanvas - margemInferior - alturaBarra;

        contexto.fillStyle = '#4f46e5';
        contexto.fillRect(posicaoX, posicaoY, larguraBarra, alturaBarra);

        contexto.fillStyle = '#1f2937';
        contexto.font = '12px Arial';
        contexto.textAlign = 'center';
        contexto.fillText(item.total, posicaoX + larguraBarra / 2, posicaoY - 6);

        contexto.fillStyle = '#6b7280';
        contexto.fillText(item.mes, posicaoX + larguraBarra / 2, alturaCanvas - 10);
    });
}