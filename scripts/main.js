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



// load page
const game = new Game({player1Name: 'Player 1', player2Name: 'Player 2'});

// play button
function valToName(num) {
    if (num === 11) return 'Jack';
    else if (num === 12) return 'Queen';
    else if (num === 13) return 'King';
    else if (num === 14) return 'Ace';
    else return num;
}

Game.prototype.endRound = function() {
    
}

function endRound(winner,loser,winCard,loseCard,...otherCards) {
    winner.cards.unshift(winCard, loseCard, ...otherCards);
    
    $display.innerText = `${winner.name} wins. ${winner.name} played ${valToName(winCard.val)}, and ${loser.name} played ${valToName(loseCard.val)}. 
    ${winner.name} has ${winner.cards.length} cards remaining, ${loser.name} has ${loser.cards.length} cards remaining.`;

}

function play() {
    const result = '';
    const p1Card = game.player1.playCard();
    const p2Card = game.player2.playCard();

    const others = [];

    if (p1Card.val >= p2Card.val) {
        endRound(game.player1, game.player2, p1Card, p2Card);
    }
    else if (p1Card.val < p2Card.val) {
        endRound(game.player2, game.player1, p2Card, p1Card);
    }

    // Write war scenario later
    //// if going to war, show 'facedown' for each of the 3 facedown cards played
}

$play.addEventListener('click', play);