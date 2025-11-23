import { Ferramenta } from "./Basicas.js";

export class Lanterna extends Ferramenta {
    #carga;

    constructor() {
        super("lanterna");
        this.#carga = 3;
    }

    usar() {
        if (this.#carga <= 0) return false;
        this.#carga--;
        return true;
    }

    get carga() {
        return this.#carga;
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
        this.#usos = 2;
    }

    usar() {
        if (this.#usos <= 0) return false;
        this.#usos--;
        return true;
    }

    get usosRestantes() {
        return this.#usos;
    }
}

export class Bomba extends Ferramenta {
    constructor() {
        super("bomba");
    }

    usar() {
        return true;
    }
}
