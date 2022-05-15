(function(){

'use strict';

const $display = document.querySelector('.display');
const $p1Name = document.querySelector('.player1-name-input');
const $p2Name = document.querySelector('.player2-name-input');
const $draw = document.querySelector('.draw');
const $p1Card = document.querySelector('.p1Card');
const $p2Card = document.querySelector('.p2Card');
const $p1Deck = document.querySelector('.p1Deck');
const $p2Deck = document.querySelector('.p2Deck');
const $cardPot = document.querySelector('.cardPot');
const $cardTemplate = document.querySelector('.card-template');

const cardSeparation = 4;
const moveTime = 600;
const resultTime = 1200;

function Card({val, suit}) { 
    this.val = val;
    this.suit = suit;
    this.domElement = null;
}

function Deck() {
    this.cards = [];
    const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const suits = ['clubs','diamonds','hearts','spades'];

    suits.forEach(suit => numbers
        .forEach(num => this.cards
        .push(new Card({val: num, suit: suit}))));
}

function Player({number, name, cards, cardLocation, deckLocation}) {
    this.number = number;
    this.name = name;
    this.cards = cards;
    this.cardLocation = cardLocation;
    this.deckLocation = deckLocation;
    this.burnLocation = $cardPot;
    this.drew = null;
}

function Game() {
    const gameDeck = new Deck();
    gameDeck.shuffle();

    this.player1 = new Player({number: 1, name: 'Player 1', cards: gameDeck.cards.slice(0,26), cardLocation: $p1Card, deckLocation: $p1Deck});
    this.player2 = new Player({number: 2, name: 'Player 2', cards: gameDeck.cards.slice(26,52), cardLocation: $p2Card, deckLocation: $p2Deck});
    this.cardPot = [];
    this.previousRoundWinner = null;
    this.active = true;
}

Player.prototype.updateName = function(event) {
    this.name = event.target.value;
}

Deck.prototype.shuffle = function() {
    this.cards.sort(() => Math.random() - 0.5);
}

function valToName(num) {
    if (num === 11) return 'Jack';
    else if (num === 12) return 'Queen';
    else if (num === 13) return 'King';
    else if (num === 14) return 'Ace';
    else return num;
}

const cloneTemplate = function(template) {
    return template.content.cloneNode(true);
}

const editImgSrcAlt = function(img, newSrc, newAlt) {
    img.src = newSrc;
    img.alt = newAlt;
}

const createCardDOMElement = function(card) {
    const clone = cloneTemplate($cardTemplate).children[0];
    editImgSrcAlt(clone.querySelector('.front-img'),`images/${valToName(card.val).toString().toLowerCase()}_of_${card.suit}.png`,`${valToName(card.val).toString()} of ${card.suit}`);
    card.domElement = clone;
}

const stackCards = function(cardContainer) {
    let cards = cardContainer.querySelectorAll('.card');

    cards.forEach((card,i) => {
        card.style.zIndex = `${i}`;
        card.style.bottom = `${i * cardSeparation}px`;
})};

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

Card.prototype.setCSSDistances = function(endPositionElement) {
    this.domElement.style.setProperty('--x-distance',`${getDistanceX(this.domElement,endPositionElement)}px`);
    this.domElement.style.setProperty('--y-distance',`${getDistanceY(this.domElement,endPositionElement)}px`);
}

const animate = function(domElement, cssClass, animationTime, backgroundFunction) {
    domElement.classList.add(cssClass);
    setTimeout(() => {
        backgroundFunction();
        domElement.classList.remove(cssClass);
    }, animationTime);
}

const shiftUp = function(domElement) {
    domElement.style.bottom = `${Number(domElement.style.bottom.split('px')[0].trim()) + cardSeparation}px`;
}

const shiftCardsUp = function(cardContainer) {
    let cardDomElements = cardContainer.querySelectorAll('.card');
    cardDomElements.forEach(cardDomElement => shiftUp(cardDomElement));
};

Card.prototype.moveToUI = function(destinationCardContainer,topOfDeck = false) {
    this.flipDown();
    this.setCSSDistances(destinationCardContainer);

    shiftCardsUp(destinationCardContainer);
    animate(this.domElement,'move', moveTime, () => {
        if (topOfDeck) {
            destinationCardContainer.appendChild(this.domElement);
        }
        else {
            destinationCardContainer.prepend(this.domElement);
        }
        
        stackCards(destinationCardContainer);
    });
}

Card.prototype.moveToArray = function(destinationArray) {
    destinationArray.unshift(this);
}

Game.prototype.startGame = function() {
    this.getPlayers().forEach(player => {
        player.cards.forEach(card => {
            createCardDOMElement(card);
            card.moveToUI(player.deckLocation, true);
            animate(card.domElement,'create-deck', 3000, () => {});
        });
    });
};

Card.prototype.flipUp = function() {
    this.domElement.classList.add('face-up');
}

Card.prototype.flipDown = function() {
    this.domElement.classList.remove('face-up');
}

Game.prototype.getPlayers = function() {
    return Object.entries(this).filter(entry => entry[0].includes('player')).map(entry => entry[1]);
}

Player.prototype.drawCard = function() {
    return this.cards.pop();
}

Player.prototype.playCard = function() {
    const playedCard = this.drawCard();
    playedCard.moveToUI(this.cardLocation);
    playedCard.flipUp();
    return playedCard;
}

Player.prototype.burnCard = function() {
    const burnedCard = this.drawCard();
    burnedCard.moveToUI(this.burnLocation);
    return burnedCard;
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
}

Game.prototype.checkIfWar = function() {
    const p1 = this.player1;
    const p2 = this.player2;

    if (p1.drew.val > p2.drew.val) this.endRound(p1, p2);
    else if (p1.drew.val < p2.drew.val) this.endRound(p2, p1);
    else if (p1.drew.val === p2.drew.val) this.goToWar();
}

const disableButton = function() {
    $draw.disabled = 'disabled';
    setTimeout(() => $draw.disabled = '', moveTime + resultTime);
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

Player.prototype.burnAllCards = function() {
    this.cards.forEach(() => this.burnCard());
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
            animate(player.drew.domElement,`player${player.number}-war-card`, resultTime, () => {});
        }, moveTime);
    })
    this.previousRoundWinner = null;
}

Game.prototype.gameOver = function(loser) {
    $display.innerText = `Game over. ${this.getPlayers().find(player => player !== loser).name} wins!`;
    $draw.disabled = 'disabled';
}

const game = new Game();
game.startGame.call(game);

$draw.addEventListener('click', game.draw.bind(game));
$p1Name.addEventListener('blur', game.player1.updateName.bind(game.player1));
$p2Name.addEventListener('blur', game.player2.updateName.bind(game.player2));

})();