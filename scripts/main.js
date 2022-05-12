const $draw = document.querySelector('.draw');
const $display = document.querySelector('.display');

function Card({val,faceUp = false}) { 
    this.val = val;
    this.faceUp = faceUp;
}

function Deck() {
    this.cards = [];

    const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const suits = [0, 0, 0, 0];

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

Game.prototype.endRound = function(winner, loser, winCard, loseCard) {
    if (loser.cards.length === 0) {
        this.gameOver(loser);
        return;
    }
    
    winner.cards.unshift(winCard, loseCard, ...this.cardPot);
    this.cardPot = [];
    
    $display.innerText = `${winner.name} wins. ${winner.name} drew ${valToName(winCard.val)}, and ${loser.name} drew ${valToName(loseCard.val)}. 
    ${this.player1.name} has ${this.player1.cards.length} cards remaining, ${this.player2.name} has ${this.player2.cards.length} cards remaining.`;
}

Game.prototype.goToWar = function(card1,card2) {
    for (let player of Object.values(this)) {
        if (player instanceof Player && player.cards.length < 4) {
            this.gameOver(player);
            return;
        }
    }
    
    Object.values(this)
        .filter(value => value instanceof Player)
        .forEach(player => [0, 0, 0].forEach(() => this.cardPot.push(player.drawCard(false))));
    this.cardPot.push(card1,card2);

    $display.innerText = `War! Both players drew ${valToName(card1.val)}. There are ${this.cardPot.length} cards in the pot.`;
}

Game.prototype.draw = function() {
    for (let player of Object.values(this)) {
        if (player instanceof Player) {
            player.drew = player.drawCard(true);
            if (player.drew === undefined) {
                this.gameOver(player); 
                return;
            };
        }
    }

    const p1 = this.player1;
    const p2 = this.player2;

    if (p1.drew.val > p2.drew.val) this.endRound(p1, p2, p1.drew, p2.drew);
    else if (p1.drew.val < p2.drew.val) this.endRound(p2, p1, p2.drew, p1.drew);
    else if (p1.drew.val === p2.drew.val) this.goToWar(p1.drew,p2.drew);
}

Game.prototype.gameOver = function(loser) {
    $display.innerText = `Game over, ${loser.name} has no more cards. ${Object.values(this).find(value => value instanceof Player && value !== loser).name} is the winner!`;
    console.log($display.innerText);
    this.active = false;
}

Game.prototype.playFullGame = function() {
    while (this.active) {
        this.draw();
    }
}

const game = new Game({player1Name: 'Player 1', player2Name: 'Player 2'});

$draw.addEventListener('click', game.draw.bind(game));