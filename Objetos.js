import { validate } from "bycontract";
import { Objeto, Ferramenta } from "./Basicas.js";
import { Lanterna, KitFusivel, CartaoAcesso } from "./Ferramentas.js";

// Painel elétrico no corredor escuro – precisa de lanterna pra "funcionar"
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

        // Só reage se a ferramenta for a Lanterna
        if (!(ferramenta instanceof Lanterna)) {
            return false;
        }

        // Marca que a ação deu certo (aciona a descrição 'depois' e permite liberar o kit)
        this.acaoOk = true;
        return true;
    }
}

// Gerador principal na sala de manutenção – precisa do kit de fusível
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

        // Só aceita KitFusivel
        if (!(ferramenta instanceof KitFusivel)) {
            return false;
        }

        this.acaoOk = true;
        return true;
    }
}

// Porta de escape na sala de segurança – depende de energia + autorização + cartão
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

        // Só reage a CartaoAcesso (outras ferramentas não fazem nada)
        if (!(ferramenta instanceof CartaoAcesso)) {
            return false;
        }

        this.acaoOk = true;
        return true;
    }
}

// ---------- NOVOS OBJETOS ----------

// Terminal que libera o protocolo de evacuação no Centro de Controle
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

        // Só aceita o CartaoAcesso
        if (!(ferramenta instanceof CartaoAcesso)) {
            return false;
        }

        this.acaoOk = true;
        return true;
    }
}

// Diário no dormitório – mais para lore e dicas
export class DiarioTripulante extends Objeto {
    constructor() {
        super(
            "diario_tripulante",
            "Um diário surrado repousa sobre uma das camas.",
            "As últimas páginas descrevem tentativas de restaurar energia e escapar pela porta de segurança."
        );
    }

    usar(ferramenta) {
        // Não tem interação mecânica forte, então sempre retorna false.
        // A "interação real" é o texto que a sala mostra para o jogador.
        validate(ferramenta, Ferramenta);
        return false;
    }
}

// Armário sem função até então
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
        // Nenhuma ferramenta abre esse armário
        return false;
    }
}
