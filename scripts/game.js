import { $display, $draw, $p1Score, $p2Score, $p1Card, $p2Card, $p1Deck, $p2Deck, $cardPot, startTime, moveTime, resultTime, warTime } from './main.js';
import { Player } from './player.js';
import { Deck } from './deck.js';
import { createCardDOMElement, animate, disableButton } from './helpers.js';

export function Game() {
    const gameDeck = new Deck();
    gameDeck.shuffle();

    this.player1 = new Player({number: 1, name: 'Player 1', cards: gameDeck.cards.slice(0,26), cardLocation: $p1Card, deckLocation: $p1Deck, scoreElement: $p1Score});
    this.player2 = new Player({number: 2, name: 'Player 2', cards: gameDeck.cards.slice(26,52), cardLocation: $p2Card, deckLocation: $p2Deck, scoreElement: $p2Score});
    this.cardPot = [];
    this.previousRoundWinner = null;
    this.active = true;
}

Game.prototype.startGame = function() {
    this.getPlayers().forEach(player => {
        player.cards.forEach(card => {
            createCardDOMElement(card);
            card.moveToUI(player.deckLocation, true);
            animate(card.domElement,'create-deck', startTime, () => {});
        });
    });
};

Game.prototype.getPlayers = function() {
    return Object.entries(this).filter(entry => entry[0].includes('player')).map(entry => entry[1]);
}

Game.prototype.updateScores = function() {
    $display.innerText = `${this.player1.cards.length} - ${this.player2.cards.length}`;
    //this.getPlayers().forEach(player => player.scoreElement.textContent = player.cards.length);
}

Game.prototype.moveTableCardsToWinner = function() {
    this.getPlayers().forEach(player => {
        player.drew.moveToUI(this.previousRoundWinner.deckLocation);
        player.drew.moveToArray(this.previousRoundWinner.cards);
    })
    this.cardPot.forEach(card => {
        card.moveToUI(this.previousRoundWinner.deckLocation);
        card.moveToArray(this.previousRoundWinner.cards);
    });
    this.cardPot = [];
}

Game.prototype.moveTableCardsToPot = function() {
    this.getPlayers().forEach(player => {
        player.drew.moveToUI($cardPot);
        player.drew.moveToArray(this.cardPot);
    });
}

Game.prototype.clearForNextTurn = function() {
    if (this.previousRoundWinner) {
        this.moveTableCardsToWinner();
    }
    else {
        this.moveTableCardsToPot();
        this.getPlayers().forEach(player => Array(3).fill().forEach(() => this.cardPot.push(player.burnCard())));
    }
    this.updateScores();
}

Game.prototype.checkIfWar = function() {
    const p1 = this.player1;
    const p2 = this.player2;

    if (p1.drew.val > p2.drew.val) this.endRound(p1, p2);
    else if (p1.drew.val < p2.drew.val) this.endRound(p2, p1);
    else if (p1.drew.val === p2.drew.val) this.goToWar();
}

Game.prototype.draw = function() {
    disableButton();

    if (this.player1.drew) {
        this.clearForNextTurn();
    }   
 
    for (let player of this.getPlayers()) {
        player.drew = player.playCard();

        if (player.drew === undefined) {
            this.gameOver(player); 
            return;
        };
    }

    this.checkIfWar();
}

Game.prototype.endRound = function(winner, loser) {
    if (loser.cards.length === 0) {
        this.gameOver(loser);
        return;
    }

    setTimeout(() => {animate(winner.drew.domElement,'winner-card', resultTime, () => {})}, moveTime);
    this.previousRoundWinner = winner;
}

Game.prototype.goToWar = function() {
    for (let player of this.getPlayers()) {
        if (player.cards.length < 4) {
            player.burnAllCards();
            this.gameOver(player);
            return;
        }
    }

    this.getPlayers().forEach(player => {
        setTimeout(() => {
            animate(player.drew.domElement,`player${player.number}-war-card`, warTime, () => {});
        }, moveTime);
    })
    this.previousRoundWinner = null;
}

Game.prototype.gameOver = function(loser) {
    $display.innerText = `Game over. ${this.getPlayers().find(player => player !== loser).name} wins!`;
    $draw.disabled = 'disabled';
}