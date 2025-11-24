import { validate } from "bycontract";
import { Sala, Engine } from "./Basicas.js";
import { Lanterna, KitFusivel, CartaoAcesso, Bomba } from "./Ferramentas.js";
import { PainelEletrico, GeradorPrincipal, PortaEscape, TerminalEmergencia, DiarioTripulante, ArmarioEquipamentos } from "./Objetos.js";

// Sala inicial: onde o jogador nasce e tem acesso às principais rotas
export class HallPrincipal extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Hall_Principal", engine);

        // Lanterna já disponível logo de cara
        const lanterna = new Lanterna();
        this.ferramentas.set(lanterna.nome, lanterna);

        // Bomba opcional (risco de derrota direta)
        const bomba = new Bomba();
        this.ferramentas.set(bomba.nome, bomba);

        // Armário só para compor cenário
        const armario = new ArmarioEquipamentos();
        this.objetos.set(armario.nome, armario);
    }

    usa(ferramenta, objeto) {
        validate(arguments, ["String", "String"]);

        if (!this.engine.mochila.tem(ferramenta)) {
            console.log(`Você não possui a ferramenta "${ferramenta}" na mochila.`);
            return false;
        }

        if (!this.objetos.has(objeto)) {
            console.log(`Aqui no Hall não há nada com que "${ferramenta}" possa interagir chamado "${objeto}".`);
            return false;
        }

        const obj = this.objetos.get(objeto);
        const ferr = this.engine.mochila.pega(ferramenta);

        const usou = obj.usar(ferr);
        if (!usou) {
            console.log(`Você tenta usar "${ferramenta}" em "${objeto}", mas nada acontece.`);
        }
        return usou;
    }
}

// Corredor escuro – onde o jogador precisa da lanterna para enxergar o painel
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
            console.log(`Você não possui a ferramenta "${ferramenta}" na mochila.`);
            return false;
        }

        const ferr = this.engine.mochila.pega(ferramenta);
        const painel = this.objetos.get("painel_eletrico");

        // Lógica especial para lanterna, por conta da carga e condição de derrota
        if (ferr instanceof Lanterna) {

            const consumiu = ferr.usar();

            if (!consumiu) {
                // Se tentar usar a lanterna sem carga e ainda não resolveu o painel, derrota
                if (!painel.acaoOk) {
                    console.log("A lanterna pisca algumas vezes e apaga de vez. Você fica completamente no escuro.");
                    this.engine.indicaDerrota(
                        "Sem iluminação, você não consegue mais operar o painel nem encontrar uma saída segura."
                    );
                } else {
                    console.log("A lanterna não acende mais. Parece totalmente descarregada.");
                }
                return false;
            }

            // Se o objeto que o jogador passou nem existe aqui, só consome carga e dá feedback genérico
            if (!this.objetos.has(objeto)) {
                console.log(`Você ilumina "${objeto}", mas não encontra nada de útil.`);
                console.log(`Carga restante da lanterna: ${ferr.carga}.`);
                return true;
            }

            const obj = this.objetos.get(objeto);
            const usouNoObjeto = obj.usar(ferr);

            if (obj instanceof PainelEletrico) {
                if (usouNoObjeto) {
                    console.log("Você ilumina o painel e finalmente consegue enxergar os detalhes internos.");
                    console.log(`Carga restante da lanterna: ${ferr.carga}.`);

                    // Ao resolver o painel, o kit de fusível aparece
                    const kit = new KitFusivel();
                    if (!this.ferramentas.has(kit.nome)) {
                        this.ferramentas.set(kit.nome, kit);
                        console.log("Um compartimento se abre ao lado do painel, revelando um kit de fusível!");
                    }
                    return true;
                } else {
                    console.log("Você ilumina o painel, mas nada de diferente acontece.");
                    console.log(`Carga restante da lanterna: ${ferr.carga}.`);
                    return false;
                }
            }

            // Qualquer outro objeto iluminado
            if (!usouNoObjeto) {
                console.log(`Você ilumina "${objeto}", mas nada acontece de relevante.`);
            }
            console.log(`Carga restante da lanterna: ${ferr.carga}.`);
            return usouNoObjeto;
        }

        // Se não for lanterna, cai na lógica padrão
        if (!this.objetos.has(objeto)) {
            console.log(`Não há nenhum objeto "${objeto}" neste corredor.`);
            return false;
        }

        const obj = this.objetos.get(objeto);
        const usou = obj.usar(ferr);

        if (!usou) {
            console.log(`Você tenta usar "${ferramenta}" em "${objeto}", mas nada acontece.`);
        }

        return usou;
    }
}

// Sala de manutenção – onde o jogador liga o gerador e pega o cartão
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
            console.log(`Você não possui a ferramenta "${ferramenta}" na mochila.`);
            return false;
        }

        if (!this.objetos.has(objeto)) {
            console.log(`Não há nenhum objeto "${objeto}" nesta sala de manutenção.`);
            return false;
        }

        const obj = this.objetos.get(objeto);
        const ferr = this.engine.mochila.pega(ferramenta);

        const usou = obj.usar(ferr);

        if (obj instanceof GeradorPrincipal && usou) {
            // Marca a flag global de energia restaurada
            this.engine.energiaRestaurada = true;

            // Libera o cartão de acesso na sala
            const cartao = new CartaoAcesso();
            if (!this.ferramentas.has(cartao.nome)) {
                this.ferramentas.set(cartao.nome, cartao);
                console.log("O gerador liga e libera um cartão de acesso de um compartimento escondido!");
            }
        } else if (!usou) {
            console.log(`Você tenta usar "${ferramenta}" em "${objeto}", mas nada acontece.`);
        }

        return usou;
    }
}

// Sala de segurança – aqui fica a porta final de escape
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
            console.log(`Você não possui a ferramenta "${ferramenta}" na mochila.`);
            return false;
        }

        const ferr = this.engine.mochila.pega(ferramenta);

        // Lanterna aqui é só decorativa (ilumina, mas não muda estados importantes)
        if (ferr instanceof Lanterna) {
            const consumiu = ferr.usar();

            if (!consumiu) {
                console.log("Você tenta acender a lanterna, mas ela não responde. A bateria parece ter ido para o espaço.");
                console.log("Aqui, a falta de lanterna não te derrota diretamente, mas você está no escuro.");
                return false;
            }

            if (!this.objetos.has(objeto)) {
                console.log(`Você ilumina "${objeto}", mas não há nada de útil para ver.`);
            } else {
                console.log("Você ilumina a porta de escape e o leitor de cartão, mas isso não muda o estado do sistema.");
            }
            console.log(`Carga restante da lanterna: ${ferr.carga}.`);
            return true;
        }

        if (!this.objetos.has(objeto)) {
            console.log(`Não há nenhum objeto "${objeto}" nesta sala de segurança.`);
            return false;
        }

        const obj = this.objetos.get(objeto);

        // Lógica principal da porta: precisa de cartão + energia + autorização
        if (ferr instanceof CartaoAcesso) {

            if (!this.engine.energiaRestaurada) {
                console.log("A porta continua travada. Não há energia suficiente na estação.");
                return false;
            }

            if (!this.engine.autorizacaoEscape) {
                console.log("O leitor apita em amarelo: 'PROTOCOLO DE EVACUAÇÃO NÃO AUTORIZADO'. Talvez exista um terminal de emergência em outra sala.");
                return false;
            }

            const usouCartao = obj.usar(ferr);

            if (obj instanceof PortaEscape && usouCartao) {
                console.log("O leitor reconhece o cartão. A porta de escape se abre.");
                // Marca fim de jogo (vitória)
                this.engine.indicaFimDeJogo();
                return true;
            }

            console.log("Você passa o cartão, mas nada acontece.");
            return false;
        }

        // Qualquer outra ferramenta que não seja lanterna ou cartão
        const usou = obj.usar(ferr);
        if (!usou) {
            console.log(`Você tenta usar "${ferramenta}" em "${objeto}", mas nada acontece.`);
        }
        return usou;
    }
}

// --------- NOVA SALA: CENTRO DE CONTROLE ---------
export class CentroControle extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Centro_de_Controle", engine);

        const terminal = new TerminalEmergencia();
        this.objetos.set(terminal.nome, terminal);
    }

    usa(ferramenta, objeto) {
        validate(arguments, ["String", "String"]);

        if (!this.engine.mochila.tem(ferramenta)) {
            console.log(`Você não possui a ferramenta "${ferramenta}" na mochila.`);
            return false;
        }

        if (!this.objetos.has(objeto)) {
            console.log(`Não há nenhum objeto "${objeto}" no centro de controle chamado "${objeto}".`);
            return false;
        }

        const obj = this.objetos.get(objeto);
        const ferr = this.engine.mochila.pega(ferramenta);

        // Aqui é o ponto onde liberamos o protocolo de evacuação
        if (obj instanceof TerminalEmergencia && ferr instanceof CartaoAcesso) {

            const usou = obj.usar(ferr);

            if (usou) {
                // Seta flag global indicando que agora a porta pode ser usada na Sala de Segurança
                this.engine.autorizacaoEscape = true;
                console.log("Você usa o cartão no terminal de emergência.");
                console.log("O sistema exibe: 'PROTOCOLO DE EVACUAÇÃO AUTORIZADO'. As rotas de escape foram liberadas.");
                return true;
            }

            console.log("Você insere o cartão, mas o terminal não aceita a autenticação.");
            return false;
        }

        const usouGenerico = obj.usar(ferr);
        if (!usouGenerico) {
            console.log(`Você tenta usar "${ferramenta}" em "${objeto}", mas nada acontece.`);
        }
        return usouGenerico;
    }
}

// --------- NOVA SALA: DORMITÓRIO DA TRIPULAÇÃO ---------
export class DormitorioTripulacao extends Sala {
    constructor(engine) {
        validate(engine, Engine);
        super("Dormitorio_Tripulacao", engine);

        const diario = new DiarioTripulante();
        this.objetos.set(diario.nome, diario);
    }

    usa(ferramenta, objeto) {
        validate(arguments, ["String", "String"]);

        if (!this.engine.mochila.tem(ferramenta)) {
            console.log(`Você não possui a ferramenta "${ferramenta}" na mochila.`);
            return false;
        }

        if (!this.objetos.has(objeto)) {
            console.log(`Não há nenhum objeto "${objeto}" neste dormitório.`);
            return false;
        }

        const obj = this.objetos.get(objeto);
        const ferr = this.engine.mochila.pega(ferramenta);

        const usou = obj.usar(ferr);

        if (!usou) {
            console.log("Você folheia o diário, mas nenhuma ação com a ferramenta parece necessária. Ainda assim, algumas anotações podem te dar pistas sobre a estação.");
        }
        return usou;
    }
}
