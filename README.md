# Estação Aurora – Jogo de Aventura PUCRS

## 1. Descrição geral

Este projeto é a implementação da **Fase 2** do trabalho da disciplina de **Programação Orientada a Objetos (POO)** da PUCRS.

O jogo é um **aventura textual** simplificado, desenvolvido em **JavaScript**, baseado na infraestrutura fornecida pelos professores (`Basicas.js`, `Engine`, `Sala`, `Objeto`, `Ferramenta`).

O jogador controla um técnico de manutenção preso em uma estação subterrânea chamada **Estação Aurora**. Após uma falha crítica de energia, a missão é:

> **Restaurar a energia auxiliar da estação e abrir a porta de escape na Sala de Segurança para fugir com vida.**

---

## 2. Enigma e mapa do jogo

### 2.1. Objetivo do jogo

Para vencer o jogo, o jogador deve:

1. Pegar uma **lanterna** no `Hall_Principal`;
2. Usar a lanterna no `painel_eletrico` no `Corredor_Escuro` para revelar um **kit de fusível**;
3. Levar o `kit_fusivel` até a `Sala_de_Manutencao` e usá-lo no `gerador_principal` para restaurar a energia auxiliar;
4. Coletar o `cartao_acesso` liberado após religar o gerador;
5. Ir até a `Sala_de_Seguranca` e usar o `cartao_acesso` na `porta_escape`;
6. Ao usar o cartão com sucesso, o jogo é finalizado com a condição de vitória.

### 2.2. Salas do mapa (4 ambientes)

O mapa é composto por **4 salas**:

- **Hall_Principal** (sala inicial / hub central)  
  - Ferramenta: `lanterna`  
  - Portas para: `Corredor_Escuro`, `Sala_de_Seguranca`

- **Corredor_Escuro**  
  - Objeto: `painel_eletrico`  
  - Ferramenta: `kit_fusivel` (aparece após usar a lanterna no painel)  
  - Portas para: `Hall_Principal`, `Sala_de_Manutencao`

- **Sala_de_Manutencao**  
  - Objeto: `gerador_principal`  
  - Ferramenta: `cartao_acesso` (aparece após usar o `kit_fusivel` no gerador)  
  - Porta para: `Corredor_Escuro`

- **Sala_de_Seguranca**  
  - Objeto: `porta_escape`  
  - Porta para: `Hall_Principal`

### 2.3. Comandos disponiveis 
O jogo é totalmente textual e utiliza os comandos a seguir (digitados no console):
- pega <nome_da_ferramenta>
- usa <nome_da_ferramenta> < objeto >
- sai <nome_da_sala_destino>
- inventario
- fim 
---

## 3. Como executar o projeto

### 3.1. Pré-requisitos

- **Node.js instalado na máquina.**
- **Pacotes NPM utilizados:**
    - bycontract
    - prompt-sync

### 3.1. Instalação das dependências
No diretório do projeto, execute:
- npm install bycontract prompt-sync

### 3.2. Execução do jogo
- node index.js

## 4. Fase 2 

- Tratamento de erros para os comandos pega, usa e sai 
    - Objetivo de melhorar a experiência do usuário e tornar o jogo mais intuitivo.

- Condição de derrota
    - Implementar lógica para condição de derrota do jogador.

- Consumo de itens
    - Refinar a lógica de consumo de itens para o jogador tomar decisões mais estratégicas.

- Deixar os comandos mais intuitivos
    - Implementar lógica de menu Help/Ajuda para auxiliar o jogador com os comandos.