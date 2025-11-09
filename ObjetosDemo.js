import { validate } from "bycontract";
import { Objeto, Ferramenta } from "./Basicas.js";
import { Chave, Martelo } from "./FerramentasDemo.js";

export class Armario extends Objeto {
	constructor() {
		super("armario","O armário está fechado",
			  "O armário está aberto. Não tem nada dentro");
	}

	usar(ferramenta) {
        validate(ferramenta,Ferramenta);
		if (ferramenta instanceof Chave) {
			this.acaoOk = true;
			return true;
		}
		return false;
	}

}
// ---------------------------------------------
export class Bilhete extends Objeto {
    constructor() {
		super("bilhete","Há um bilhete, nele está escrito \"A vida é doce!\"","");
	}

	usar(ferramenta) {
        validate(ferramenta,Ferramenta);
		return false;
	}
}

// ---------------------------------------------
export class PoteDeAcucar extends Objeto {
	constructor() {
		super("pote_de_acucar","O pote de açúcar esta fechado",
			  "O pote de açúcar esta quebrado. Tinha um diamante dentro!");
	}

	usar(ferramenta) {
        validate(ferramenta,Ferramenta);
		console.log(ferramenta.nome);
		if (ferramenta instanceof Martelo) {
			this.acaoOk = true;
			return true;
		}
		return false;
	}
}
// ---------------------------------------------
export class PoteDeArroz extends Objeto {
	constructor() {
		super("pote_de_arroz","O pote de arroz esta fechado",
			  "O pote de arroz esta quebrado. Tem arroz espalhado por todo lado");
	}

	usar(ferramenta) {
        validate(ferramenta,Ferramenta);
		if (ferramenta instanceof Martelo) {
			this.acaoOk = true;
			return true;
		}
		return false;
	}
}
// ---------------------------------------------
