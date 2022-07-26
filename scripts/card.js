import { stackCards, getDistanceX, getDistanceY, animate, shiftCardsUp } from './helpers.js';
import { moveTime } from './main.js';

export function Card({val, suit}) { 
    this.val = val;
    this.suit = suit;
    this.domElement = null;
}

Card.prototype.setCSSDistances = function(endPositionElement) {
    this.domElement.style.setProperty('--x-distance',`${getDistanceX(this.domElement,endPositionElement)}px`);
    this.domElement.style.setProperty('--y-distance',`${getDistanceY(this.domElement,endPositionElement)}px`);
}

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

Card.prototype.flipUp = function() {
    this.domElement.classList.add('face-up');
}

Card.prototype.flipDown = function() {
    this.domElement.classList.remove('face-up');
}