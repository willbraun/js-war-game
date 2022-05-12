(function(){

'use strict';

const $draw = document.querySelector('.draw');
const $display = document.querySelector('.display');
const $playFull = document.querySelector('.playFullGame');
const $p1Card = document.querySelector('.p1Card');
const $p2Card = document.querySelector('.p2Card');
const $p1Deck = document.querySelector('.p1Deck');
const $p2Deck = document.querySelector('.p2Deck');
const $cardPot = document.querySelector('.cardPot');


function Card({val,faceUp = false}) { 
    this.val = val;
    this.faceUp = faceUp;
}

function Deck() {
    this.cards = [];

    const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const suits = Array(4).fill();

    suits.forEach(() => numbers.forEach(num => this.cards.push(new Card({val: num}))));
    this.cards.sort(() => Math.random() - 0.5);
}

function Player({name, cards, drew = null}) {
    this.name = name;
    this.cards = cards;
    this.drew = drew;
}

function Game({player1Name, player2Name}) {
    const gameDeck = new Deck().cards;

    this.player1 = new Player({name: player1Name, cards: gameDeck.slice(0,26)});
    this.player2 = new Player({name: player2Name, cards: gameDeck.slice(26,52)});
    this.cardPot = [];
    this.active = true;
}

Game.prototype.displayCards = function() {
    // for both players, go through each card in the deck and create a div of the card with class 'facedown'

    
    const deckHTML = 'banana';
    $p1Deck.innerHTML = deckHTML;

    // Add to CSS that facedown class means to fill the div with an image of the back of a card
    // Find way to offset each card by a tiny bit in CSS within the card-container
};

Player.prototype.drawCard = function(showCard) {
    const drawnCard = this.cards.pop();
    drawnCard.faceUp = showCard;
    return drawnCard;
}

function valToName(num) {
    if (num === 11) return 'Jack';
    else if (num === 12) return 'Queen';
    else if (num === 13) return 'King';
    else if (num === 14) return 'Ace';
    else return num;
}

Game.prototype.getPlayers = function() {
    return Object.values(this).filter(player => player instanceof Player);
}

Game.prototype.endRound = function(winner, loser, winCard, loseCard) {
    if (loser.cards.length === 0) {
        this.gameOver(loser);
        return;
    }
    
    winner.cards.unshift(winCard, loseCard, ...this.cardPot);
    this.cardPot = [];
    
    $display.innerText = `${winner.name} wins this round. ${winner.name} drew ${valToName(winCard.val)}, and ${loser.name} drew ${valToName(loseCard.val)}. 
    ${this.player1.name} has ${this.player1.cards.length} cards remaining, ${this.player2.name} has ${this.player2.cards.length} cards remaining.`;
}

Game.prototype.goToWar = function(card1,card2) {
    for (let player of this.getPlayers()) {
        if (player.cards.length < 4) {
            this.gameOver(player);
            return;
        }
    }
    
    this.getPlayers().forEach(player => Array(3).fill().forEach(() => this.cardPot.push(player.drawCard(false))));
    this.cardPot.push(card1,card2);

    $display.innerText = `War! Both players drew ${valToName(card1.val)}. There are ${this.cardPot.length} cards in the pot.`;
}

Game.prototype.draw = function() {
    for (let player of this.getPlayers()) {
        player.drew = player.drawCard(true);
        if (player.drew === undefined) {
            this.gameOver(player); 
            return;
        };
    }

    const p1 = this.player1;
    const p2 = this.player2;

    if (p1.drew.val > p2.drew.val) this.endRound(p1, p2, p1.drew, p2.drew);
    else if (p1.drew.val < p2.drew.val) this.endRound(p2, p1, p2.drew, p1.drew);
    else if (p1.drew.val === p2.drew.val) this.goToWar(p1.drew,p2.drew);
}

Game.prototype.gameOver = function(loser) {
    $display.innerText = `Game over, ${loser.name} has no more cards. ${this.getPlayers().find(player => player !== loser).name} is the winner!`;
    this.active = false;
}

Game.prototype.playFullGame = function() {
    while (this.active) {
        this.draw();
    }
 } 

const game = new Game({player1Name: 'Player 1', player2Name: 'Player 2'});

$draw.addEventListener('click', game.draw.bind(game));
$playFull.addEventListener('click', game.playFullGame.bind(game));

})();