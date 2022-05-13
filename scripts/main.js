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
const $temp = document.querySelector('.card-template');

function Card({val, suit, faceUp = false}) { 
    this.val = val;
    this.suit = suit;
    // this.html = `
    // <div class="card">
    //     <div class="front">
    //         <img src="images/${valToName(val).toString().toLowerCase()}_of_${suit}.png" alt="${val} of ${suit}">
    //     </div>
    //     <div class="back">
    //         <img src="images/back.png" alt="back of card">
    //     </div>
    // </div>`;
    this.domElement = null;
    this.faceUp = faceUp;
}

function Deck() {
    this.cards = [];
    const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const suits = ['clubs','diamonds','hearts','spades'];

    suits.forEach(suit => numbers
        .forEach(num => this.cards
        .push(new Card({val: num, suit: suit}))));
}

function Player({name, cards, cardLocation, deckLocation}) {
    this.name = name;
    this.cards = cards;
    this.cardLocation = cardLocation;
    this.deckLocation = deckLocation;
    this.drew = null;
}

function Game({player1Name, player2Name}) {
    const gameDeck = new Deck();
    gameDeck.shuffle();

    this.player1 = new Player({name: player1Name, cards: gameDeck.cards.slice(0,26), cardLocation: $p1Card, deckLocation: $p1Deck});
    this.player2 = new Player({name: player2Name, cards: gameDeck.cards.slice(26,52), cardLocation: $p2Card, deckLocation: $p2Deck});
    this.cardPot = [];
    this.active = true;
}

Deck.prototype.shuffle = function() {
    this.cards.sort(() => Math.random() - 0.5);
}

Game.prototype.displayCards = function() {
    // loop through both players, and each card in their deck
    
    // clone the template
    const clone1 = $temp.content.cloneNode(true);
    const clone2 = $temp.content.cloneNode(true);
    
    // edit the clone
    // clone.querySelector('.front-img').src = "test string"; // string interpolation here for correct src and alt
    // clone.querySelector('.front-img').alt = "test string"
    // update the z-index and bottom px styles on card class div based on index in forEach, see below

    // reference clone from that card's element property. card.element = clone;
    const testCard = new Card({val: 2, suit: 'spades'});
    testCard.domElement = clone1;

    // append clone to that player's deckLocation
    this.player1.deckLocation.appendChild(clone1);
    this.player2.deckLocation.appendChild(clone2);
    

    

    // const cardDiv = document.createElement('div');
    // const frontDiv = document.createElement('div');
    // const backDiv = document.createElement('div');
    // const frontImg = document.createElement('img');
    // const backImg = document.createElement('img');

    // cardDiv.classList.add('card');
    // frontDiv.classList.add('front');
    // backDiv.classList.add('back');
    // frontImg.src = `images/${valToName(val).toString().toLowerCase()}_of_${suit}.png`;
    // frontImg.alt = `${val} of ${suit}`;
    // backImg.


    // cardDiv.appendChild(frontDiv).appendChild(backDiv);
    
    
    // this.getPlayers().forEach(player => {
    //     let deckHTML = player.cards.map((card,i) => {
    //         return `<img src="images/back.png" class="card" style="z-index: ${i}; bottom: ${i * 3}px">`;
    //     }).join('');
    //     player.deckLocation.innerHTML = deckHTML;
    // });

};

const getElementX = function(element) {
    return element.getBoundingClientRect().left;
}

const getElementY = function(element) {
    return element.getBoundingClientRect().top;
}

const getDistanceX = function(startElement,endElement) {
    return getElementX(endElement) - getElementX(startElement);
}

const getDistanceY = function(startElement,endElement) {
    return getElementY(endElement) - getElementY(startElement);
} 

const moveElement = function(elementToMove, endPositionElement) {
    elementToMove.style.setProperty('--x-distance',`${getElementX(endPositionElement) - getElementX(elementToMove)}px`);
    elementToMove.style.setProperty('--y-distance',`${getElementY(endPositionElement) - getElementY(elementToMove)}px`);

    console.log(elementToMove);
}

Card.prototype.setCSSDistances = function(endPositionElement) {
    this.domElement.style.setProperty('--x-distance',`${getDistanceX(this.domElement,endPositionElement)}px`);
    this.domElement.style.setProperty('--y-distance',`${getDistanceY(this.domElement,endPositionElement)}px`);
}

Card.prototype.moveTo = function(endPositionElement) {
    this.setCSSDistances(endPositionElement);
    this.domElement.classList.add('move');
    setTimeout(() => this.domElement.classList.remove('move'),1000);
}

Player.prototype.drawCard = function(showCard) {
    const drawnCard = this.cards.pop();
    drawnCard.domElement = this.deckLocation.querySelector('.card'); // this will be set in the display cards function earlier
    console.log(drawnCard.domElement);
    if (showCard) {
        //const testCard = this.deckLocation.querySelector('.card');
        drawnCard.domElement.classList.add('face-up');
        drawnCard.moveTo(this.cardLocation);
    }
    // drawnCard.domElement

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
game.displayCards.call(game);

$draw.addEventListener('click', game.draw.bind(game));
$playFull.addEventListener('click', game.playFullGame.bind(game));

})();