import {validate} from "bycontract";
import promptsync from 'prompt-sync';
const prompt = promptsync({sigint: true});

// Representa qualquer ferramenta que o jogador pode carregar e usar 
export class Ferramenta {
	#nome;

	constructor(nome) {
        // Garante que o nome sempre seja string 
        validate(nome,"String");
		this.#nome = nome;
	}

	get nome() {
		return this.#nome;
	}
	
	// Por padrão, "usar" uma ferramenta só retorna true.
	// As subclasses podem sobrescrever esse comportamento.
	usar() {
		return true;
	}
}

// Mochila é o "inventário" do jogador, onde as ferramentas ficam guardadas
export class Mochila{
	#ferramentas;

	constructor(){
		// Começa com a mochila vazia
		this.#ferramentas = [];
	}

	// Guarda uma ferramenta na mochila
	guarda(ferramenta){
		validate(ferramenta,Ferramenta);
		this.#ferramentas.push(ferramenta);
	}

	// Retorna a referência da ferramenta com o nome informado (não remove da mochila)
	pega(nomeFerramenta){
		validate(arguments,["String"]);
		let ferramenta = this.#ferramentas.find(f => f.nome === nomeFerramenta);
		return ferramenta;
	}

	// Verifica se a mochila possui uma ferramenta com aquele nome
	tem(nomeFerramenta){
		validate(arguments,["String"]);
		return this.#ferramentas.some(f => f.nome === nomeFerramenta);
	}

	// Retorna uma string com a lista de nomes das ferramentas, separadas por vírgula
	inventario(){
		return this.#ferramentas.map(obj => obj.nome).join(", ");
	}
}


// Objeto é qualquer coisa do cenário com a qual o jogador pode interagir 
export class Objeto {
	#nome;
    #descricaoAntesAcao;
    #descricaoDepoisAcao;
    #acaoOk;
    	
	constructor(nome,descricaoAntesAcao, descricaoDepoisAcao) {
		// Nome e as descrições antes/depois de interagir
		validate(arguments,["String","String","String"]);
		this.#nome = nome;
		this.#descricaoAntesAcao = descricaoAntesAcao;
		this.#descricaoDepoisAcao = descricaoDepoisAcao;
		// Começa como "não resolvido"
		this.#acaoOk = false;
	}
	
	get nome(){
		return this.#nome;
	}

	get acaoOk() {
		return this.#acaoOk;
	}

	set acaoOk(acaoOk) {
		validate(acaoOk,"Boolean");
		this.#acaoOk = acaoOk;
	}

	// A descrição que será mostrada depende se o objeto já foi "resolvido" ou não
	get descricao() {
		if (!this.acaoOk) {
			return this.#descricaoAntesAcao;
		}else {
			return this.#descricaoDepoisAcao;
		}
	}

	// Método genérico de uso – cada objeto (Painel, Porta, etc.) implementa sua lógica
	usa(ferramenta,objeto){
	}
}

// Sala é um "ambiente" do jogo: tem objetos, ferramentas e portas para outras salas
export class Sala {
	#nome;
	#objetos;
	#ferramentas;
	#portas;
	#engine;
	
	constructor(nome,engine) {
		// Cada sala tem um nome e uma referência para a Engine 
		validate(arguments,["String",Engine]);
		this.#nome = nome;
		this.#objetos = new Map();      
		this.#ferramentas = new Map();  
		this.#portas = new Map();       
		this.#engine = engine;          
	}

	get nome() {
		return this.#nome;
	}
	
	get objetos() {
		return this.#objetos;
	}

	get ferramentas() {
		return this.#ferramentas;
	}
	
	get portas(){
		return this.#portas;
	}

	get engine(){
		return this.#engine;
	}
	
	// Retorna uma lista textual dos objetos disponíveis nessa sala
	objetosDisponiveis(){
		let arrObjs = [...this.#objetos.values()];
    	return arrObjs.map(obj=>obj.nome+":"+obj.descricao);
	}

	// Lista o nome das ferramentas que estão largadas na sala (antes de pegar)
	ferramentasDisponiveis(){
		let arrFer = [...this.#ferramentas.values()];
    	return arrFer.map(f=>f.nome);		
	}
	
	// Lista o nome das salas acessíveis pelas portas desta sala
	portasDisponiveis(){
		let arrPortas = [...this.#portas.values()];
    	return arrPortas.map(sala=>sala.nome);
	}
	
	// Tenta pegar uma ferramenta da sala e colocar na mochila do jogador
	pega(nomeFerramenta) {
		validate(nomeFerramenta,"String");
		let ferramenta = this.#ferramentas.get(nomeFerramenta);
		if (ferramenta != null) {
			this.#engine.mochila.guarda(ferramenta);
			this.#ferramentas.delete(nomeFerramenta);
			return true;
		}else {
			return false;
		}
	}

	// Troca o jogador de sala, se existir uma porta com esse nome
	sai(porta) {
		validate(porta,"String");
		return this.#portas.get(porta);
	}

	// Monta o textinho padrão mostrado quando o jogador entra na sala
	textoDescricao() {
		let descricao = "Você está no "+this.nome+"\n";
        if (this.objetos.size == 0){
            descricao += "Não há objetos na sala\n";
        }else{
            descricao += "Objetos: "+this.objetosDisponiveis()+"\n";
        }
        if (this.ferramentas.size == 0){
            descricao += "Não há ferramentas na sala\n";
        }else{
            descricao += "Ferramentas: "+this.ferramentasDisponiveis()+"\n";
        }
        descricao += "Portas: "+this.portasDisponiveis()+"\n";
		return descricao;
	}

	// Cada sala concreta decide como lida com o comando "usa"
	usa(ferramenta,objeto){
		return false;
	}
}


// Engine é o "cérebro" do jogo: controla loop principal, estado atual e fim de jogo
export class Engine{
	#mochila;
	#salaCorrente;
	#fim;
	#derrota;
	#mensagemDerrota;

	constructor(){
		this.#mochila = new Mochila();
		this.#salaCorrente = null;
		this.#fim = false;

		// Flags de estado de fim de jogo
		this.#derrota = false;
		this.#mensagemDerrota = "";

		// Quem herda de Engine deve sobrescrever criaCenario()
		this.criaCenario();
	}

	get mochila(){
		return this.#mochila;
	}

	get salaCorrente(){
		return this.#salaCorrente;
	}

	set salaCorrente(sala){
		validate(sala,Sala);
		this.#salaCorrente = sala;
	}

	// Marca o jogo como encerrado (usado na vitória também)
	indicaFimDeJogo(){
		this.#fim = true;
	}

	// Marca fim de jogo por derrota e guarda a mensagem
	indicaDerrota(mensagem) {
		this.#fim = true;
		this.#derrota = true;
		this.#mensagemDerrota = mensagem || "";
	}

	// Menu de ajuda simples para o jogador lembrar dos comandos
	mostraAjuda() {
		console.log("===== AJUDA =====");
		console.log("Comandos disponíveis:");
		console.log('- pega <ferramenta>          -> pega uma ferramenta da sala');
		console.log('- usa <ferramenta> <objeto>  -> usa uma ferramenta em um objeto');
		console.log('- sai <nome_da_sala>         -> sai pela porta para outra sala');
		console.log('- inventario                 -> mostra o que está na sua mochila');
		console.log('- ajuda / help               -> mostra este menu de ajuda');
		console.log('- fim                        -> encerra o jogo');
		console.log("Exemplos:");
		console.log('  pega lanterna');
		console.log('  usa lanterna painel_eletrico');
		console.log('  sai Corredor_Escuro');
		console.log("=================");
	}

	// A subclasse (Jogo) é que monta as salas e conexões aqui
	criaCenario(){}

	// Loop principal do jogo: lê comando, interpreta e reage
	joga() {
		let novaSala = null;
		let acao = "";
		let tokens = null;

		console.log('Digite "ajuda" para ver a lista de comandos.\n');

		while (!this.#fim) {
			console.log("-------------------------");
			console.log(this.salaCorrente.textoDescricao());
			acao = prompt("O que voce deseja fazer? ");

			// Evita comando vazio
			if (!acao || acao.trim().length === 0) {
				console.log('Você não digitou nenhum comando. Digite "ajuda" para ver as opções.');
				continue;
			}

			tokens = acao.trim().split(/\s+/);
			const comando = tokens[0].toLowerCase();

			switch (comando) {
			case "fim":
				// Fecha o jogo na marra
				this.#fim = true;
				break;

			case "ajuda":
			case "help":
				this.mostraAjuda();
				break;

			case "pega":
				// Espera algo como: pega lanterna
				if (tokens.length < 2) {
					console.log('Uso correto: pega <nome_da_ferramenta>. Ex: pega lanterna');
					break;
				}
				if (this.salaCorrente.pega(tokens[1])) {
					console.log("Ok! " + tokens[1] + " guardado!");
				} else {
					console.log("Não há nenhum(a) " + tokens[1] + " nesta sala.");
				}
				break;

			case "inventario":
				// Mostra o que já está na Mochila
				const inv = this.#mochila.inventario();
				if (!inv) {
					console.log("Sua mochila está vazia.");
				} else {
					console.log("Ferramentas disponíveis para serem usadas: " + inv);
				}
				break;

			case "usa":
				// Espera algo como: usa lanterna painel_eletrico
				if (tokens.length < 3) {
					console.log('Uso correto: usa <ferramenta> <objeto>. Ex: usa lanterna painel_eletrico');
					break;
				}

				const nomeFerramenta = tokens[1];
				const alvo = tokens[2];

				// --------- TRATAMENTO GLOBAL DA BOMBA ---------
				// A bomba é um caso especial: usar em qualquer lugar = derrota imediata
				if (nomeFerramenta === "bomba") {
					if (!this.#mochila.tem("bomba")) {
						console.log('Você tenta usar uma bomba, mas não tem nenhuma na mochila.');
						break;
					}

					console.log("Você posiciona a bomba perto de " + alvo + " e a ativa...");
					console.log("Em poucos segundos, uma explosão toma conta do ambiente!");
					this.indicaDerrota("Você foi explodido pela própria bomba.");

					break;
				}

				// --------- FLUXO NORMAL PARA OUTRAS FERRAMENTAS ---------
				// Delega a lógica para a sala atual decidir o que acontece
				if (this.salaCorrente.usa(nomeFerramenta, alvo)) {
					console.log("Feito !!");
					if (this.#fim === true) {
						// Se alguma sala marcou o fim de jogo, consideramos vitória aqui
						console.log("Parabens, voce venceu!");
					}
				} else {
					console.log("Não é possível usar " + nomeFerramenta + " sobre " + alvo + " nesta sala");
				}
				break;

			case "sai":
				// Espera algo como: sai Sala_de_Seguranca
				if (tokens.length < 2) {
					console.log('Uso correto: sai <nome_da_sala>. Ex: sai Hall_Principal');
					break;
				}
				novaSala = this.salaCorrente.sai(tokens[1]);
				if (novaSala == null) {
					console.log("Você não vê nenhuma porta levando para '" + tokens[1] + "'.");
				} else {
					this.#salaCorrente = novaSala;
				}
				break;

			default:
				console.log("Comando desconhecido: " + tokens[0]);
				console.log('Digite "ajuda" para ver a lista de comandos.');
				break;
			}
		}

		// Ao sair do loop principal, mostramos o desfecho
		if (this.#derrota) {
			console.log("\n=== FIM DE JOGO ===");
			console.log("Você foi derrotado!");
			if (this.#mensagemDerrota) {
				console.log(this.#mensagemDerrota);
			}
		} else {
			console.log("Jogo encerrado!");
		}
	}
}
