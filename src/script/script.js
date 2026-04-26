// DADOS SIMULADOS
const listaDeContatos = [
    {
        id: 1,
        nome: "Ricardo",
        ultimaMensagem: "Já tomei o Remédio ff",
        horarioUltimaMensagem: "23:55",
        vistoPorUltimo: "Visto por Último 5 minutos Atrás",
        avatar: "./src/assets/images/Ricardo.png",
        conversas: [
            {mensagem: "já estamos num apocalipse...", tipo: "recebida", horario: "23:50"},
            {mensagem: "Tomou o remédio 💊?", tipo: "enviada", horario: "23:52"},
            {mensagem: "tomei obgd", tipo: "recebida", horario: "23:55"},
        ],
        respostasBot: [
            "Vou ver o filme do Chainsaw Man",
            "Vou até fazer pipoca doce pra ver 😍",
            "Poxa perdi meu óculos...",
        ],
    },
    {
        id: 2,
        nome: "Miguel",
        ultimaMensagem: "Pelo menos n ta cheio de inimigos...",
        horarioUltimaMensagem: "22:30",
        vistoPorUltimo: "Visto por Último 10 minutos Atrás",
        avatar: "./src/assets/images/Miguel.png",
        conversas: [
            {mensagem: "Assiste Vinland Saga ff", tipo: "recebida", horario: "22:29"},
            {mensagem: "Po to cheio de anime aqui pra ver, mas vou por na lista!", tipo: "enviada", horario: "22:30"},
            {mensagem: "Pelo menos n ta cheio de inimigos...", tipo: "recebida", horario: "22:30"},
        ],
        respostasBot: [
            "Estarei na loja amanhã 👍",
            "Eu sou mt thorfin slc",
            "Vou fazer frango e cookies!",
        ],
    },
    {
        id: 3,
        nome: "Bernardo",
        ultimaMensagem: "Mas eu tive que fechar o Nazo.",
        horarioUltimaMensagem: "21:27",
        vistoPorUltimo: "Visto por Último 15 minutos Atrás",
        avatar: "./src/assets/images/Bernardo.png",
        conversas: [
            {mensagem: "Tenho uma notícia ruim mano", tipo: "recebida", horario: "21:27"},
            {mensagem: "Eu sei que tu curtia o rodízio la...", tipo: "recebida", horario: "21:27"},
            {mensagem: "Mas eu tive que fechar o Nazo.", tipo: "recebida", horario: "21:27"},
        ],
        respostasBot: [
            "Os bixo deixando tudo sem etiqueta po, tive piedade não",
            "Ainda mais com sushi mano, tem q ter o dobro de cuidado",
            "Quando tu abrir tua loja de macarrão com batata palha, melhor tu etiquetar tudo ff!",
        ],
    },
    {
        id: 4,
        nome: "Gennari",
        ultimaMensagem: "Ai Que Dor de Cabeça!",
        horarioUltimaMensagem: "21:00",
        vistoPorUltimo: "Visto por Último 20 minutos Atrás",
        avatar: "./src/assets/images/Gennari.png",
        conversas: [
            {mensagem: "Tu é mt Ackerman mano", tipo: "enviada", horario: "20:50"},
            {mensagem: "Oq é isso?", tipo: "recebida", horario: "21:00"},
            {mensagem: "Ai Que Dor de Cabeça!", tipo: "recebida", horario: "21:00"},
        ],
        respostasBot: [
            "Meu joelho ta bomzinho já",
            "Nosso projeto integrador é o melhor disparado po",
            "Brincadeira Hein Houston...",
        ],
    },
]

// Aguarda o carregamento completo da página (DOM) antes de rodar os scripts
document.addEventListener('DOMContentLoaded', () => {

    // # -> IDS
    // . -> Classes

    // Selecionando os elementos fixos da tela
    const inputMsg = document.querySelector("#inputMensagem");
    const buttons = document.querySelectorAll(".cursor--pointer");
    const buttonSend = document.querySelector(".cursor--pointer[src*='send']");
    const listaMensagens = document.querySelector(".div--messages");
    const DadosContato = document.querySelector(".side--bar")
    const inputBuscaContato = document.querySelector("#inputBuscarContato");
    const inputBuscaMensagem = document.getElementById("search-message");

    // Variável para rastrear qual conversa está aberta
    let contatoAtivo = null;

    // Monitora a digitação no input de buscar mensagem
    document.addEventListener("input", (event) => {
        if (event.target && event.target.id === "search-message") {
            const termoDeBusca = event.target.value;
            buscarMensagem(termoDeBusca);
        }
    });

    // Monitora a digitação no input de buscar contatos na barra lateral
    inputBuscaContato.addEventListener("input", () => {
        const termoDeBusca = inputBuscaContato.value;
        carregarContatos(termoDeBusca);
    });

    // Monitora o clique nas mensagens para abrir as reações
    listaMensagens.addEventListener("click", (event) => {
        if (event.target.classList.contains("emojis-reaction")){
            const mensagem = event.target.closest('.message')
            abrirMenuReacao(mensagem);
        }
    });

    // Emojis que aparecem no menu
    const listaEmojis = ["&#128514;", "&#128525;", "&#128534;"]; // Códigos de emojis (reserva)
    const listaEmojis2 = ["😂", "😍", "❤️", "😯", "😖"];

    // Função que cria e exibe o menu flutuante de emojis
    function abrirMenuReacao(mensagem){
        const areaEmojis = mensagem.querySelector(".area-emojis")

        // Se o menu já estiver aberto, fecha e para a função
        if (areaEmojis.innerHTML !== "") {
            areaEmojis.innerHTML = "";
            return;
        }

        // Percorre a lista de emojis e cria os botões no HTML
        listaEmojis2.forEach((emoji) => {
            const emojiElement = document.createElement("span");
            emojiElement.classList.add("emoji-opcao", "cursor--pointer")

            // innerText -> texto sem formatação
            // innerHTML -> renderiza HTML
            //textContent -> renderiza um texto com formatação

            emojiElement.textContent = emoji;

            // Ao clicar em um emoji do menu, aplica na mensagem e fecha o menu
            emojiElement.addEventListener("click", () => {
                alternarEmoji(mensagem, emoji);
                areaEmojis.innerHTML = "";
            });

            areaEmojis.appendChild(emojiElement)
        })
    }

    // Adiciona ou remove a reação escolhida na parte inferior da mensagem
    function alternarEmoji(mensagem, emoji) {
        let reacaoExistente = mensagem.querySelector(".emoji-selecionado")

        // Se a reação já existe e é igual a que o usuário clicou, remove (toggle)
        if (reacaoExistente && reacaoExistente.textContent.includes(emoji)) {
            reacaoExistente. textContent = reacaoExistente.textContent.replace(emoji, "");

            // Se ficar sem nenhum emoji, apaga a div da reação
            if (reacaoExistente.textContent.trim() === "") {
                reacaoExistente.remove();
            } 
        } else {
            // Se não tinha reação antes, cria a caixinha flutuante
            if (!reacaoExistente) {
                reacaoExistente = document.createElement("div");
                reacaoExistente.classList.add("emoji-selecionado");
                mensagem.appendChild(reacaoExistente);
            }

            // appendChild -> incluir
            // = -> atribuir
            // += -> incluir dentro de uma variável algo a mais

            reacaoExistente.textContent += emoji;
        }
    }

    // Busca palavras dentro da conversa atual e destaca
    function buscarMensagem(termo) {
        // Pegamos os "wrappers" (as divs pai que controlam o alinhamento na tela)
        const wrappersMensagem = document.querySelectorAll(".div--messages > .width--100");

        wrappersMensagem.forEach((wrapper) => {
            // Focamos APENAS na div onde o texto da mensagem fica, preservando o horário e ícones
            const areaTexto = wrapper.querySelector(".flex--6");
            if (!areaTexto) return;

            // Salva o texto original de forma invisível na primeira vez para não perder formatação
            if (!areaTexto.dataset.textoOriginal) {
                areaTexto.dataset.textoOriginal = areaTexto.textContent.trim();
            }

            const textoOriginal = areaTexto.dataset.textoOriginal;
            const textoNormalizado = textoOriginal.toLowerCase();
            const termoNormalizado = termo.toLowerCase();

            // Se o campo de busca ficar vazio, restaura o texto original e exibe a mensagem
            if (termo === "") {
                areaTexto.innerHTML = textoOriginal;
                wrapper.style.display = "flex";
                return;
            }

            // Se encontrar a palavra buscada, aplica a marcação (highlight)
            if (textoNormalizado.includes(termoNormalizado)) {
                const regex = new RegExp(`(${termo})`, "gi");
                areaTexto.innerHTML = textoOriginal.replace(regex, "<span class='highlight'>$1</span>");
                wrapper.style.display = "flex"; 
            } else {
                // Se não tiver a palavra, esconde a mensagem
                wrapper.style.display = "none"; 
            }
        });
    }

    // Pega o texto do input e joga na tela como uma bolha enviada
    function enviarMensagem() {
        const texto = inputMsg.value.trim();

        if (texto === "") {
            alert('Escreva Sua Mensagem!');
        } else {
            const mensagemRenderizada = renderizarMensagem("enviada", texto, "23:56");
            listaMensagens.appendChild(mensagemRenderizada);
            inputMsg.value = "";

            //setTimeout  -> Executa alguma coisa apenas uma única vez, após um intervalo de tempo
            //setInterval -> Executa alguma coisa em um intervalo de tempo

            setTimeout(responderMensagem, 3000);
        }
    }

    // Inteligência do Bot: Puxa uma resposta aleatória do contato ativo
    function responderMensagem() {
        if (contatoAtivo === null) return;

        const contatoAtual = listaDeContatos[contatoAtivo];
        const respostasDoContato = contatoAtual.respostasBot;

        // Sorteia uma posição do array de respostas
        const posicao = Math.floor(Math.random() * respostasDoContato.length);
        const mensagemDoBot = respostasDoContato[posicao];

        const mensagemRenderizada = renderizarMensagem("recebida", mensagemDoBot, "23:56");
        listaMensagens.appendChild(mensagemRenderizada);
    }

    // Clique no botão de enviar
    buttonSend.addEventListener("click", () => {
        enviarMensagem();
    });

    // Pressionar a tecla Enter no teclado
    inputMsg.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            enviarMensagem();
        }
    });

    // Monta o cabeçalho superior com foto, nome e status do contato
    function renderizarDadosContato(avatar, nome, vistoPorUltimo) {
        const divDadosContato = document.createElement("div");

        divDadosContato.classList.add("flex", "flex--direction--row", "align--items--center", "side--bar", "fade-in")

        divDadosContato.innerHTML = `
                <!-- Foto do Contato -->
                <div class="flex flex--direction--row justify--content--center flex--1 avatar--top--bar">
                    <img src="${avatar}">
                </div>

                <!-- Nome do Contato -->
                <div class="flex flex--direction--column flex--13">

                    <div class="contact--name">${nome}</div>

                    <div class="contact--status">${vistoPorUltimo}</div>
                </div>

                <!-- Ícones do Contato -->
                <div
                    class="flex flex--direction--row justify--content--end align--items--center flex--3 div--sidebar--icons">
                    <div class=" flex justify--content--center align--items--center flex--5 search">
                        <div class="flex align--items--center  background--light--grey div--search">
                            <img src="./src/assets/icons/search.svg" alt="Ícone Search">
                            <input type="search" id="search-message" placeholder="Buscar Mensagem">
                        </div>
                    </div>
                    <img src="./src/assets/icons/phone.svg" alt="Icone Telefone">
                    <img src="./src/assets/icons/more.svg" alt="Icone Mais">
                </div>
        `
        return divDadosContato;
    }

    // Monta a bolha da mensagem
    function renderizarMensagem(tipo, mensagem, horario) {
        const divMensagem = document.createElement("div");
        const direcao = tipo === "enviada" ? "end" : "start";
        const stylesDiv = tipo === "enviada" ? "you" : "other";

        divMensagem.classList.add("flex", "flex--direction--row", "width--100", `justify--content--${direcao}`, "fade-in")

        divMensagem.innerHTML = `
                <div class="flex flex--direction--column message ${stylesDiv}">
                    <div class="flex--6">
                        ${mensagem}
                    </div>
                    <div class="flex--1 flex flex--direction--row justify--content--end align--items--center font--size--12 infos--message">
                        <div class = "emojis-reaction cursor--pointer">&#x1F44D;</div>
                        <div class = "area-emojis"></div>
                        <div>${horario}</div>
                        <img src="./src/assets/icons/viewed.svg" alt="Ícone Visualizado">
                    </div>
                </div>
        `;

        return divMensagem;
    }

    // Limpa o chat e carrega todas as mensagens do array "conversas"
    function carregarMensagemContato(index) {
        const contato = listaDeContatos[index];
        listaMensagens.innerHTML = "";

        // Adiciona a tarja de data "Hoje" no topo do chat
        const divData = document.createElement("div");
        divData.classList.add("flex", "date--chat", "justify--content--center", "align--items--center", "fade-in");
        divData.textContent = "Hoje";
        listaMensagens.appendChild(divData)

        // Renderiza bolha por bolha
        contato.conversas.forEach((conversa) => {
            const mensagemRenderizada = renderizarMensagem(conversa.tipo, conversa.mensagem, conversa.horario);
            listaMensagens.appendChild(mensagemRenderizada);
        });
    }

    // Preenche o cabeçalho superior com as infos do contato clicado
    function carregarDadosContato(index) {
        const contato = listaDeContatos[index];
        DadosContato.innerHTML = ""; // Limpa o contato anterior

        const dadosContatoRenderizado = renderizarDadosContato(contato.avatar, contato.nome, contato.vistoPorUltimo);
        DadosContato.appendChild(dadosContatoRenderizado);
    }

    // Carrega a lista lateral de contatos
    function carregarContatos(filtro = '') {
        const divContatosElement = document.querySelector(".div--contacts");
        divContatosElement.innerHTML = "";

        // Filtra contatos com base no que foi digitado na busca
        const contatosFiltrados = listaDeContatos.filter((contato) => contato.nome.toLowerCase().includes(filtro.toLowerCase()));

        // Mensagem de erro caso a busca não retorne nada
        if (contatosFiltrados.length === 0) {
            divContatosElement.innerHTML = "<div><span>Contato não encontrado...</span></div>";
            return;
        }

        // Monta a div lateral de cada amigo na lista
        contatosFiltrados.forEach((contato, index) => {
            const divParentElement = document.createElement("div");
            divParentElement.classList.add("flex", "area--contact", "fade-in");

            divParentElement.innerHTML = `
                    <!-- Foto Conversa -->
                    <div class="flex justify--content--center align--items--center flex--1">
                        <img class="avatar--left--bar" src="${contato.avatar}">
                    </div>

                    <!-- Informações Contato -->
                    <div class="flex flex--direction--column justify--content--center flex--3">
                        <!-- Nome Contato -->
                        <div class="flex align--items--center infos--contact">
                            <div class="font--family font--weight--bold">${contato.nome}</div>
                        </div>

                        <!-- Ultima Mensagem -->
                        <div class="last--message">${contato.ultimaMensagem}</div>
                    </div>

                    <!-- Horário e Notificação -->
                    <div
                        class="flex flex--direction--column justify--content--center align--items--end flex--1 div--last--messages--info">
                        <!-- Horário -->
                        <div class="hour--last--message">${contato.horarioUltimaMensagem}</div>
                    </div>
            `;

            // Quando eu clico na barra do contato
            divParentElement.addEventListener("click", () => {
                trocarBackground(divParentElement) // Pinta de escuro

                contatoAtivo = index; // Salva quem está aberto
                carregarMensagemContato(index); // Injeta as conversas
                carregarDadosContato(index) // Atualiza foto e nome lá no topo

                // Fazer o campo de texto aparecer, limpar e focar o teclado
                document.querySelector("#area-input-mensagem").style.display = "flex";
                inputMsg.value = "";
                inputMsg.focus();
            });

            divContatosElement.appendChild(divParentElement); 
        });
 
        // Função que gerencia o destaque visual de quem foi clicado
    function trocarBackground(elementoClicado) {
        const contatoAnterior = document.querySelector(".area--contact.active");
        if (contatoAnterior) {
            contatoAnterior.classList.remove("active"); // Desmarca o antigo
        }

        elementoClicado.classList.add("active"); // Marca o atual
    }
    }

    // Delay inicial de 1.5s simulando o carregamento dos contatos (Loading)
    setTimeout(() => {
        carregarContatos();     
    }, 1500);
    
})