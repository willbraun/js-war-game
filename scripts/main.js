const $play = document.querySelector('.play');
const $display = document.querySelector('.display');

function Card({val, name}) { 
    this.val = val;
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
}

Player.prototype.playCard = function() {
    return this.cards.pop()
}

function valToName(num) {
    if (num === 11) return 'Jack';
    else if (num === 12) return 'Queen';
    else if (num === 13) return 'King';
    else if (num === 14) return 'Ace';
    else return num;
}

Game.prototype.endRound = function(winner,loser,winCard,loseCard,...otherCards) {
    winner.cards.unshift(winCard, loseCard, ...otherCards);
    
    $display.innerText = `${winner.name} wins. ${winner.name} drew ${valToName(winCard.val)}, and ${loser.name} drew ${valToName(loseCard.val)}. 
    ${this.player1.name} has ${this.player1.cards.length} cards remaining, ${this.player2.name} has ${this.player2.cards.length} cards remaining.`;
}

Game.prototype.draw = function() {
    const p1Card = this.player1.playCard();
    const p2Card = this.player2.playCard();

    const others = [];

    if (p1Card.val >= p2Card.val) {
        game.endRound(game.player1, game.player2, p1Card, p2Card);
    }
    else if (p1Card.val < p2Card.val) {
        game.endRound(game.player2, game.player1, p2Card, p1Card);
    }

    // Write war scenario later
    //// if going to war, show 'facedown' for each of the 3 facedown cards played
}

const game = new Game({player1Name: 'Player 1', player2Name: 'Player 2'});

$play.addEventListener('click', game.draw);