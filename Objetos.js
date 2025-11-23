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

        this.acaoOk = true;
        return true;
    }
}

// ---------- NOVOS OBJETOS ----------

// Usado no Centro de Controle com cartao_acesso
export class TerminalEmergencia extends Objeto {
    constructor() {
        super(
            "terminal_emergencia",
            "Um terminal de controle mostra vários alertas críticos, mas está bloqueado.",
            "O terminal exibe: 'PROTOCOLO DE EVACUAÇÃO AUTORIZADO'. As rotas de escape foram liberadas."
        );
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);

        if (!(ferramenta instanceof CartaoAcesso)) {
            return false;
        }

        this.acaoOk = true;
        return true;
    }
}

// Lore no Dormitório
export class DiarioTripulante extends Objeto {
    constructor() {
        super(
            "diario_tripulante",
            "Um diário surrado repousa sobre uma das camas.",
            "As últimas páginas descrevem tentativas de restaurar energia e escapar pela porta de segurança."
        );
    }

    usar(ferramenta) {
        // Não precisa de ferramenta, sempre retorna false para uso “mecânico”.
        validate(ferramenta, Ferramenta);
        return false;
    }
}

// Objeto extra para compor o cenário
export class ArmarioEquipamentos extends Objeto {
    constructor() {
        super(
            "armario_equipamentos",
            "Um armário metálico trancado, com marcas de uso intenso.",
            "O armário continua trancado. Parece que o mecanismo interno está danificado."
        );
    }

    usar(ferramenta) {
        validate(ferramenta, Ferramenta);
        // Por enquanto nenhum equipamento abre esse armário
        return false;
    }
}
