import { $cardPot } from './main.js';

export function Player({number, name, cards, cardLocation, deckLocation, scoreElement}) {
    this.number = number;
    this.name = name;
    this.cards = cards;
    this.cardLocation = cardLocation;
    this.deckLocation = deckLocation;
    this.burnLocation = $cardPot;
    this.scoreElement = scoreElement;
    this.drew = null;
}

Player.prototype.updateName = function(event) {
    this.name = event.target.value;
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

Player.prototype.burnAllCards = function() {
    this.cards.forEach(() => this.burnCard());
}

Player.prototype.updateScore = function() {
    this.scoreElement.innerText = this.cards.length;
}