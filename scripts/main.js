const $draw = document.querySelector('.draw');
const $display = document.querySelector('.display');

function Card({val,faceUp = false}) { 
    this.val = val;
    this.faceUp = faceUp;
}

function Deck() {
    this.cards = [];

    const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const suits = [0, 1, 2, 3];

    suits.forEach(suit => numbers.forEach(num => this.cards.push(new Card({val: num}))));
    this.cards.sort((a, b) => Math.random() - 0.5);
}

function Player({name, cards}) {
    this.name = name;
    this.cards = cards;
}

function Game({player1Name, player2Name}) {
    const gameDeck = new Deck().cards;
    this.player1 = new Player({name: player1Name, cards: gameDeck.slice(0,26)});
    this.player2 = new Player({name: player2Name, cards: gameDeck.slice(26,52)});
    this.cardPot = [];
}

Player.prototype.drawCard = function(showCard) {
    const drawnCard = this.cards.pop();
    drawnCard.faceUp = showCard;
    return drawnCard;
}

Player.prototype.checkIfLost = function() {
    
}

function valToName(num) {
    if (num === 11) return 'Jack';
    else if (num === 12) return 'Queen';
    else if (num === 13) return 'King';
    else if (num === 14) return 'Ace';
    else return num;
}

Game.prototype.endRound = function(winner, loser, winCard, loseCard) {
    winner.cards.unshift(winCard, loseCard, ...this.cardPot);
    this.cardPot = [];
    
    $display.innerText = `${winner.name} wins. ${winner.name} drew ${valToName(winCard.val)}, and ${loser.name} drew ${valToName(loseCard.val)}. 
    ${this.player1.name} has ${this.player1.cards.length} cards remaining, ${this.player2.name} has ${this.player2.cards.length} cards remaining.`;

}

Game.prototype.goToWar = function(card1,card2) {
    Object.keys(this)
        .filter(key => key.includes('player'))
        .forEach(key => [0,0,0]
        .forEach(index => this.cardPot.push(this.player1.drawCard(false))));
    
    this.cardPot.push(card1,card2);
    $display.innerText = `War! Both players drew ${valToName(card1.val)}. There are ${this.cardPot.length} cards in the pot.`;
}

Game.prototype.draw = function() {
    const p1Card = this.player1.drawCard(true);
    const p2Card = this.player2.drawCard(true);

    if (p1Card.val > p2Card.val) {
        this.endRound(this.player1, this.player2, p1Card, p2Card);
    }
    else if (p1Card.val < p2Card.val) {
        this.endRound(this.player2, this.player1, p2Card, p1Card);
    }
    else {
        this.goToWar(p1Card,p2Card);
    }
}



Game.prototype.gameOver = function() {

}

const game = new Game({player1Name: 'Player 1', player2Name: 'Player 2'});

$draw.addEventListener('click', game.draw.bind(game));