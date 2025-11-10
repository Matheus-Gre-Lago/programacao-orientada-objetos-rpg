import { validate } from "bycontract";
import { Objeto, Ferramenta } from "./Basicas.js";
import { Lanterna, KitFusivel, CartaoAcesso } from "./Ferramentas.js";

export class PainelEletrico extends Objeto {
    constructor() {
        super(
            "painel_eletrico",
            "Um painel elétrico está embutido na parede, mas está escuro demais para enxergar os detalhes.",
            "Com a ajuda da lanterna, você enxerga o interior do painel. Um compartimento lateral se abre."
        );
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);

        if (!(ferramenta instanceof Lanterna)) {
            return false;
        }

        // Verifica se a lanterna ainda tem carga (para etapa final)
        if (!ferramenta.usar()) {
            return false;
        }

        this.acaoOk = true;
        return true;
    }
}

export class GeradorPrincipal extends Objeto {
    constructor() {
        super(
            "gerador_principal",
            "O gerador principal está desligado. O compartimento de fusíveis está queimado.",
            "O gerador volta a funcionar, estabilizando a energia auxiliar da estação."
        );
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);

        if (!(ferramenta instanceof KitFusivel)) {
            return false;
        }

        this.acaoOk = true;
        return true;
    }
}

export class PortaEscape extends Objeto {
    constructor() {
        super(
            "porta_escape",
            "A porta de escape está trancada. Um leitor de cartão emite uma luz vermelha.",
            "O leitor de cartão fica verde, os trincos se destravam e a porta de escape se abre."
        );
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);

        if (!(ferramenta instanceof CartaoAcesso)) {
            return false;
        }

        if (!ferramenta.usar()) {
            return false;
        }

        this.acaoOk = true;
        return true;
    }
}