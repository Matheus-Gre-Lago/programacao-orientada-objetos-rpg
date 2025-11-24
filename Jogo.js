import { Engine } from "./Basicas.js";
import { HallPrincipal, CorredorEscuro, SalaManutencao, SalaSeguranca, CentroControle, DormitorioTripulacao } from "./Salas.js";

// Jogo é a "versão concreta" da Engine: aqui a gente monta o cenário (salas, conexões, etc.)
export class Jogo extends Engine {
    constructor() {
        super();
        // Flags globais que as salas usam para checar o progresso do jogador
        this.energiaRestaurada = false;      // setado na SalaManutencao
        this.autorizacaoEscape = false;      // setado no CentroControle
    }

    // Aqui é onde o "mapa" da estação é montado
    criaCenario() {
        const hall = new HallPrincipal(this);
        const corredor = new CorredorEscuro(this);
        const manutencao = new SalaManutencao(this);
        const seguranca = new SalaSeguranca(this);
        const centro = new CentroControle(this);
        const dormitorio = new DormitorioTripulacao(this);

        // Ligações do Hall (ele funciona como hub principal)
        hall.portas.set(corredor.nome, corredor);
        hall.portas.set(seguranca.nome, seguranca);
        hall.portas.set(centro.nome, centro);
        hall.portas.set(dormitorio.nome, dormitorio);

        // Corredor liga com hall e manutenção
        corredor.portas.set(hall.nome, hall);
        corredor.portas.set(manutencao.nome, manutencao);

        // Manutenção liga com corredor
        manutencao.portas.set(corredor.nome, corredor);

        // Sala de segurança liga com hall
        seguranca.portas.set(hall.nome, hall);

        // Centro de controle liga com hall
        centro.portas.set(hall.nome, hall);

        // Dormitório liga com hall
        dormitorio.portas.set(hall.nome, hall);

        // Sala inicial do jogo
        this.salaCorrente = hall;
    }
}