import {Engine} from "./Basicas.js"
import { Cozinha, HallEntrada, Quarto, SalaDeEstar } from "./SalasDemo.js";

export class JogoDemo extends Engine{
    constructor(){
        super();
    }

    criaCenario(){
        // Define as salas que compõem o mapa
        let hall = new HallEntrada(this);
        let sala = new SalaDeEstar(this);
        let quarto = new Quarto(this);
        let cozinha = new Cozinha(this);

        // Encadeia as salas através das portas
        hall.portas.set(sala.nome,sala);
        sala.portas.set(hall.nome,hall);
        sala.portas.set(quarto.nome,quarto);
        sala.portas.set(cozinha.nome,cozinha);
        quarto.portas.set(sala.nome,sala);
        cozinha.portas.set(sala.nome,sala);

        // Define a sala inicial
        this.salaCorrente = hall;
    }
}