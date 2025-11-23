import {validate} from "bycontract";
import promptsync from 'prompt-sync';
const prompt = promptsync({sigint: true});

export class Ferramenta {
	#nome;

	constructor(nome) {
        validate(nome,"String");
		this.#nome = nome;
	}

	get nome() {
		return this.#nome;
	}
	
	usar() {
		return true;
	}
}

export class Mochila{
	#ferramentas;

	constructor(){
		this.#ferramentas = [];
	}

	guarda(ferramenta){
		validate(ferramenta,Ferramenta);
		this.#ferramentas.push(ferramenta);
	}

	pega(nomeFerramenta){
		validate(arguments,["String"]);
		let ferramenta = this.#ferramentas.find(f => f.nome === nomeFerramenta);
		return ferramenta;
	}

	tem(nomeFerramenta){
		validate(arguments,["String"]);
		return this.#ferramentas.some(f => f.nome === nomeFerramenta);
	}

	inventario(){
		return this.#ferramentas.map(obj => obj.nome).join(", ");
	}
}


export class Objeto {
	#nome;
    #descricaoAntesAcao;
    #descricaoDepoisAcao;
    #acaoOk;
    	
	constructor(nome,descricaoAntesAcao, descricaoDepoisAcao) {
		validate(arguments,["String","String","String"]);
		this.#nome = nome;
		this.#descricaoAntesAcao = descricaoAntesAcao;
		this.#descricaoDepoisAcao = descricaoDepoisAcao;
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

	get descricao() {
		if (!this.acaoOk) {
			return this.#descricaoAntesAcao;
		}else {
			return this.#descricaoDepoisAcao;
		}
	}

	usa(ferramenta,objeto){
	}
}

export class Sala {
	#nome;
	#objetos;
	#ferramentas;
	#portas;
	#engine;
	
	constructor(nome,engine) {
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
	
	objetosDisponiveis(){
		let arrObjs = [...this.#objetos.values()];
    	return arrObjs.map(obj=>obj.nome+":"+obj.descricao);
	}

	ferramentasDisponiveis(){
		let arrFer = [...this.#ferramentas.values()];
    	return arrFer.map(f=>f.nome);		
	}
	
	portasDisponiveis(){
		let arrPortas = [...this.#portas.values()];
    	return arrPortas.map(sala=>sala.nome);
	}
	
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

	sai(porta) {
		validate(porta,"String");
		return this.#portas.get(porta);
	}

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

	usa(ferramenta,objeto){
		return false;
	}
}


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

		// flags de derrota
		this.#derrota = false;
		this.#mensagemDerrota = "";

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

	indicaFimDeJogo(){
		this.#fim = true;
	}

	indicaDerrota(mensagem) {
		this.#fim = true;
		this.#derrota = true;
		this.#mensagemDerrota = mensagem || "";
	}

	mostraAjuda() {
		console.log("===== AJUDA =====");
		console.log("Comandos disponíveis:");
		console.log('- pega <ferramenta>          -> pega uma ferramenta da sala');
		console.log('- usa <ferramenta> <objeto>  -> usa uma ferramenta em um objeto');
		console.log('- sai <nome_da_sala>         -> sai pela porta para outra sala');
		console.log('- inventario                 -> mostra o que está na sua mochila');
		console.log('- ajuda / help               -> mostra este menu de ajuda');
		console.log('- fim                        -> encerra o jogo\n');
		console.log("Exemplos:");
		console.log('  pega lanterna');
		console.log('  usa lanterna painel_eletrico');
		console.log('  sai Corredor_Escuro');
		console.log("=================\n");
	}

	criaCenario(){}

	joga() {
		let novaSala = null;
		let acao = "";
		let tokens = null;

		console.log('Digite "ajuda" para ver a lista de comandos.\n');

		while (!this.#fim) {
			console.log("-------------------------");
			console.log(this.salaCorrente.textoDescricao());
			acao = prompt("O que voce deseja fazer? ");

			if (!acao || acao.trim().length === 0) {
				console.log('Você não digitou nenhum comando. Digite "ajuda" para ver as opções.');
				continue;
			}

			tokens = acao.trim().split(/\s+/);
			const comando = tokens[0].toLowerCase();

			switch (comando) {
			case "fim":
				this.#fim = true;
				break;

			case "ajuda":
			case "help":
				this.mostraAjuda();
				break;

			case "pega":
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
				const inv = this.#mochila.inventario();
				if (!inv) {
					console.log("Sua mochila está vazia.");
				} else {
					console.log("Ferramentas disponíveis para serem usadas: " + inv);
				}
				break;

			case "usa":
				if (tokens.length < 3) {
					console.log('Uso correto: usa <ferramenta> <objeto>. Ex: usa lanterna painel_eletrico');
					break;
				}

				const nomeFerramenta = tokens[1];
				const alvo = tokens[2];

				// --------- TRATAMENTO GLOBAL DA BOMBA ---------
				if (nomeFerramenta === "bomba") {
					if (!this.#mochila.tem("bomba")) {
						console.log('Você tenta usar uma bomba, mas não tem nenhuma na mochila.');
						break;
					}

					console.log("Você posiciona a bomba perto de " + alvo + " e a ativa...");
					console.log("Em poucos segundos, uma explosão toma conta do ambiente!");
					this.indicaDerrota("Você foi explodido pela própria bomba.");

					// não chama salaCorrente.usa, o jogo acaba aqui
					break;
				}

				// --------- FLUXO NORMAL PARA OUTRAS FERRAMENTAS ---------
				if (this.salaCorrente.usa(nomeFerramenta, alvo)) {
					console.log("Feito !!");
					if (this.#fim === true) {
						// aqui pode ser vitória (ex: porta_escape)
						console.log("Parabens, voce venceu!");
					}
				} else {
					console.log("Não é possível usar " + nomeFerramenta + " sobre " + alvo + " nesta sala");
				}
				break;
			case "sai":
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