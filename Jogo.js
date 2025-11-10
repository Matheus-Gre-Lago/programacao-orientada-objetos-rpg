import { Engine } from "./Basicas.js";
import { HallPrincipal, CorredorEscuro, SalaManutencao, SalaSeguranca } from "./Salas.js";

export class Jogo extends Engine {
    constructor() {
        super();
        this.energiaRestaurada = false;
    }

    criaCenario() {
        const hall = new HallPrincipal(this);
        const corredor = new CorredorEscuro(this);
        const manutencao = new SalaManutencao(this);
        const seguranca = new SalaSeguranca(this);

        hall.portas.set(corredor.nome, corredor);
        hall.portas.set(seguranca.nome, seguranca);

        corredor.portas.set(hall.nome, hall);
        corredor.portas.set(manutencao.nome, manutencao);

        manutencao.portas.set(corredor.nome, corredor);

        seguranca.portas.set(hall.nome, hall);

        this.salaCorrente = hall;
    }
}