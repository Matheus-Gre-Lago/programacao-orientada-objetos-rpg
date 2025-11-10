import { validate } from "bycontract";
import { Sala, Engine, Ferramenta } from "./Basicas.js";
import { Lanterna, KitFusivel, CartaoAcesso } from "./Ferramentas.js";
import { PainelEletrico, GeradorPrincipal, PortaEscape } from "./Objetos.js";

export class HallPrincipal extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Hall_Principal", engine);

        // Ferramenta inicial disponível para o jogador
        const lanterna = new Lanterna();
        this.ferramentas.set(lanterna.nome, lanterna);
    }

    usa(ferramenta, objeto) {
        validate(arguments, ["String", "String"]);
        return false;
    }
}

export class CorredorEscuro extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Corredor_Escuro", engine);

        const painel = new PainelEletrico();
        this.objetos.set(painel.nome, painel);
    }

    usa(ferramenta, objeto) {
        validate(arguments, ["String", "String"]);

        if (!this.engine.mochila.tem(ferramenta)) {
            return false;
        }

        if (!this.objetos.has(objeto)) {
            return false;
        }

        const obj = this.objetos.get(objeto);
        const ferr = this.engine.mochila.pega(ferramenta);

        const usou = obj.usar(ferr);
        if (obj instanceof PainelEletrico && usou) {
            const kit = new KitFusivel();
            if (!this.ferramentas.has(kit.nome)) {
                this.ferramentas.set(kit.nome, kit);
                console.log("Um compartimento se abre ao lado do painel, revelando um kit de fusível!");
            }
        }

        return usou;
    }
}

export class SalaManutencao extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Sala_de_Manutencao", engine);

        const gerador = new GeradorPrincipal();
        this.objetos.set(gerador.nome, gerador);
    }

    usa(ferramenta, objeto) {
        validate(arguments, ["String", "String"]);

        if (!this.engine.mochila.tem(ferramenta)) {
            return false;
        }

        if (!this.objetos.has(objeto)) {
            return false;
        }

        const obj = this.objetos.get(objeto);
        const ferr = this.engine.mochila.pega(ferramenta);

        const usou = obj.usar(ferr);

        if (obj instanceof GeradorPrincipal && usou) {
            this.engine.energiaRestaurada = true;

            const cartao = new CartaoAcesso();
            if (!this.ferramentas.has(cartao.nome)) {
                this.ferramentas.set(cartao.nome, cartao);
                console.log("O gerador liga e libera um cartão de acesso de um compartimento escondido!");
            }
        }
        return usou;
    }
}

export class SalaSeguranca extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Sala_de_Seguranca", engine);

        const porta = new PortaEscape();
        this.objetos.set(porta.nome, porta);
    }

    usa(ferramenta, objeto) {
        validate(arguments, ["String", "String"]);

        if (!this.engine.mochila.tem(ferramenta)) {
            return false;
        }

        if (!this.objetos.has(objeto)) {
            return false;
        }

        const obj = this.objetos.get(objeto);
        const ferr = this.engine.mochila.pega(ferramenta);

        if (obj instanceof PortaEscape && !this.engine.energiaRestaurada) {
            console.log("A porta continua travada. Não há energia suficiente na estação.");
            return false;
        }

        const usou = obj.usar(ferr);

        if (obj instanceof PortaEscape && usou) {
            this.engine.indicaFimDeJogo();
        }
        return usou;
    }
}