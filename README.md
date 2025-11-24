# Estação Aurora – Enigma de Fuga 

Projeto da disciplina de **Programação Orientada a Objetos**: um jogo de aventura em modo texto, onde o jogador precisa escapar da **Estação Aurora** antes que tudo entre em colapso.

O foco do projeto é aplicar conceitos de POO (classes, herança, composição, encapsulamento) em um mini–engine de jogo textual.

---

## 🛰️ Contexto da História

Você é um técnico de manutenção preso na Estação Aurora após uma falha catastrófica no sistema de energia.  
A energia principal caiu, apenas alguns circuitos auxiliares ainda respondem, e a estrutura da estação está no limite.

Uma mensagem automática foi deixada nos sistemas:

> “Falha no circuito primário.  
>  Restaure a energia auxiliar.  
>  Reative o Terminal de Emergência.  
>  Libere a Porta de Escape.”

Seu objetivo é:

- Explorar as salas da estação  
- Coletar ferramentas  
- Interagir com painéis, geradores e terminais  
- Restaurar a energia auxiliar  
- Autorizar o protocolo de evacuação  
- Abrir a Porta de Escape e fugir com vida

---

## 🎯 Objetivo do Jogo

Para vencer, o jogador precisa:

1. Explorar as **6 salas** da estação;
2. Usar corretamente as **ferramentas**:
   - `lanterna`
   - `kit_fusivel`
   - `cartao_acesso`
   - `bomba` (opcional, mas perigosa);
3. Interagir com **objetos-chave**:
   - `painel_eletrico`
   - `gerador_principal`
   - `terminal_emergencia`
   - `porta_escape`
   - (além de objetos de lore, como `diario_tripulante`);
4. Seguir a sequência lógica:
   - Iluminar o painel
   - Consertar o gerador
   - Obter e usar o cartão no terminal
   - Abrir a porta de escape

Se fizer isso, escapa da Estação Aurora. Se errar demais… a estação (ou você) não aguenta.

---

## 🧩 Mapa da Estação (Salas)

O jogo possui **6 salas interligadas**:

- `Hall_Principal` *(sala inicial)*
  - Conecta com:
    - `Corredor_Escuro`
    - `Sala_de_Seguranca`
    - `Centro_de_Controle`
    - `Dormitorio_Tripulacao`

- `Corredor_Escuro`
  - Conecta com:
    - `Hall_Principal`
    - `Sala_de_Manutencao`


- `Sala_de_Manutencao`
  - Conecta com:
    - `Corredor_Escuro`

- `Sala_de_Seguranca`
  - Conecta com:
    - `Hall_Principal`

- `Centro_de_Controle`
  - Conecta com:
    - `Hall_Principal`

- `Dormitorio_Tripulacao`
  - Conecta com:
    - `Corredor_Escuro`

---

## 🛠️ Ferramentas e Objetos

### Ferramentas

- **Lanterna**
  - Tem **carga limitada**.
  - Usada principalmente para iluminar o `painel_eletrico` no `Corredor_Escuro`.
  - Cada uso consome 1 de carga.

- **Kit_Fusivel**
  - Obtido ao resolver o `painel_eletrico`.
  - Usado no `gerador_principal` na `Sala_de_Manutencao`.

- **Cartao_Acesso**
  - Obtido ao ligar o `gerador_principal`.
  - Usado no `terminal_emergencia` e depois na `porta_escape`.

- **Bomba**
  - Ferramenta “opcional”.
  - Se o jogador usar a bomba em qualquer sala, o jogo aciona uma condição de derrota imediata.

### Objetos Principais

- `painel_eletrico` – corredor escuro, precisa da lanterna para ser inspecionado
- `gerador_principal` – sala de manutenção, precisa do kit de fusível
- `terminal_emergencia` – centro de controle, precisa do cartão de acesso
- `porta_escape` – sala de segurança, precisa:
  - de energia restaurada,
  - do protocolo de evacuação autorizado,
  - e do cartão de acesso

Objetos de lore:

- `diario_tripulante` – no dormitório, dá contexto/história
- `armario_equipamentos` – no hall, mais decorativo na versão atual

---

## 🎮 Comandos do Jogo

Todos os comandos são digitados em texto, no terminal:

- `pega <ferramenta>`
  - Pega uma ferramenta da sala e coloca na mochila.
  - Ex.: `pega lanterna`

- `usa <ferramenta> <objeto>`
  - Usa uma ferramenta em um objeto da sala.
  - Ex.:
    - `usa lanterna painel_eletrico`
    - `usa kit_fusivel gerador_principal`
    - `usa cartao_acesso terminal_emergencia`
    - `usa cartao_acesso porta_escape`

- `usa bomba <algo>`
  - Usa a bomba em qualquer alvo.
  - Resultado: explosão e derrota.

- `sai <nome_da_sala>`
  - Troca de sala, se existir porta conectando.
  - Ex.: `sai Corredor_Escuro`

- `inventario`
  - Mostra as ferramentas que estão na mochila.

- `ajuda` ou `help`
  - Exibe o menu de ajuda com explicação dos comandos.

- `fim`
  - Encerra o jogo imediatamente.

---

## 💀 Condições de Derrota

Existem duas condições principais de derrota implementadas:

1. **Uso da bomba**
   - Se o jogador usar `bomba` em qualquer sala (`usa bomba qualquer_coisa`), o jogo imprime uma mensagem de explosão e termina com derrota.

2. **Lanterna sem carga no corredor escuro (painel não resolvido)**
   - Se a lanterna ficar sem carga enquanto o `painel_eletrico` ainda não foi resolvido,
   - o jogador fica completamente no escuro e o jogo encerra com derrota.

---

## 🧵 Fluxo Esperado para Vencer o Enigma

Um “caminho feliz” típico:

1. No `Hall_Principal`
   - `pega lanterna`  
   - (Opcional: `pega bomba`, se quiser brincar com a derrota)

2. `sai Corredor_Escuro`
   - `usa lanterna painel_eletrico`
   - `pega kit_fusivel`

3. `sai Sala_de_Manutencao`
   - `usa kit_fusivel gerador_principal`
   - `pega cartao_acesso`

4. `sai Hall_Principal`
   - `sai Centro_de_Controle`
   - `usa cartao_acesso terminal_emergencia` (libera protocolo de evacuação)

5. Voltar ao `Hall_Principal`
   - `sai Sala_de_Seguranca`
   - `usa cartao_acesso porta_escape`



---

## 🧱 Arquitetura do Código

O projeto é organizado em classes para separar bem responsabilidades.

### Arquivos principais

- `Basicas.js`
  - `Ferramenta`: classe base para todas as ferramentas.
  - `Mochila`: gerencia inventário do jogador.
  - `Objeto`: classe base para itens do cenário.
  - `Sala`: classe base para ambientes (salas).
  - `Engine`: “motor” do jogo (loop principal, leitura de comandos, estado de fim/derrota).

- `Ferramentas.js`
  - `Lanterna`, `KitFusivel`, `CartaoAcesso`, `Bomba`  
  (todas estendem `Ferramenta`).

- `Objetos.js`
  - `PainelEletrico`, `GeradorPrincipal`, `PortaEscape`, `TerminalEmergencia`, `DiarioTripulante`, `ArmarioEquipamentos`  
  (todas estendem `Objeto`).

- `Salas.js`
  - `HallPrincipal`, `CorredorEscuro`, `SalaManutencao`, `SalaSeguranca`, `CentroControle`, `DormitorioTripulacao`  
  (todas estendem `Sala` e implementam a lógica de `usa()`).

- `Jogo.js`
  - Estende `Engine` e monta o cenário (instancia as salas e conecta as portas).

- `index.js`
  - Ponto de entrada: cria um `Jogo` e chama `jogo.joga()`.

---