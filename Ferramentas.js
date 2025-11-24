import { Ferramenta } from "./Basicas.js";

// Lanterna: ferramenta com carga limitada, usada para iluminar o painel e outros lugares
export class Lanterna extends Ferramenta {
    #carga;

    constructor() {
        super("lanterna");
        // Começa com 3 usos
        this.#carga = 3;
    }

    // Cada vez que usa, consome 1 de carga
    usar() {
        if (this.#carga <= 0) return false;
        this.#carga--;
        return true;
    }

    // Expor a carga restante só pra feedback mesmo
    get carga() {
        return this.#carga;
    }
}

// Kit de fusível usado para consertar o GeradorPrincipal
export class KitFusivel extends Ferramenta {
    constructor() {
        super("kit_fusivel");
    }
}

// Cartão usado tanto no Terminal de Emergência quanto na Porta de Escape
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

// Bomba: ferramenta opcional cujo único objetivo é matar o jogador
export class Bomba extends Ferramenta {
    constructor() {
        super("bomba");
    }

    // A lógica de derrota está na Engine
    usar() {
        return true;
    }
}
