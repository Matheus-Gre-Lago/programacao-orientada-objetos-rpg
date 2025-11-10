import { Ferramenta } from "./Basicas.js";

export class Lanterna extends Ferramenta {
    #carga;

    constructor() {
        super("lanterna");
        this.#carga = 3; // quantidade máxima de usos
    }

    usar() {
        if (this.#carga <= 0) {
            return false;
        }
        this.#carga = this.#carga - 1;
        return true;
    }
}

export class KitFusivel extends Ferramenta {
    constructor() {
        super("kit_fusivel");
    }
}

export class CartaoAcesso extends Ferramenta {
    #usos;

    constructor() {
        super("cartao_acesso");
        this.#usos = 2; // pode abrir a porta algumas vezes
    }

    usar() {
        if (this.#usos <= 0) {
            return false;
        }
        this.#usos = this.#usos - 1;
        return true;
    }
}
