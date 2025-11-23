import { Engine } from "./Basicas.js";
import { HallPrincipal, CorredorEscuro, SalaManutencao, SalaSeguranca, CentroControle, DormitorioTripulacao } from "./Salas.js";

export class Jogo extends Engine {
    constructor() {
        super();
        this.energiaRestaurada = false;      // já usada na SalaManutencao / SalaSeguranca
        this.autorizacaoEscape = false;      // NOVO: liberado no CentroControle
    }

    criaCenario() {
        const hall = new HallPrincipal(this);
        const corredor = new CorredorEscuro(this);
        const manutencao = new SalaManutencao(this);
        const seguranca = new SalaSeguranca(this);
        const centro = new CentroControle(this);             // NOVA SALA
        const dormitorio = new DormitorioTripulacao(this);   // NOVA SALA

        // ligações do Hall
        hall.portas.set(corredor.nome, corredor);
        hall.portas.set(seguranca.nome, seguranca);
        hall.portas.set(centro.nome, centro);
        hall.portas.set(dormitorio.nome, dormitorio);

        // corredor liga com hall e manutenção
        corredor.portas.set(hall.nome, hall);
        corredor.portas.set(manutencao.nome, manutencao);

        // manutenção liga com corredor
        manutencao.portas.set(corredor.nome, corredor);

        // segurança liga com hall
        seguranca.portas.set(hall.nome, hall);

        // centro de controle liga com hall
        centro.portas.set(hall.nome, hall);

        // dormitório liga com hall
        dormitorio.portas.set(hall.nome, hall);

        this.salaCorrente = hall;
    }
}
