import { $draw, $cardTemplate, cardSeparation, moveTime, resultTime } from './main.js';

export function valToName(num) {
    if (num === 11) return 'Jack';
    else if (num === 12) return 'Queen';
    else if (num === 13) return 'King';
    else if (num === 14) return 'Ace';
    else return num;
}

export const cloneTemplate = function(template) {
    return template.content.cloneNode(true);
}

export const editImgSrcAlt = function(img, newSrc, newAlt) {
    img.src = newSrc;
    img.alt = newAlt;
}

export const createCardDOMElement = function(card) {
    const clone = cloneTemplate($cardTemplate).children[0];
    editImgSrcAlt(clone.querySelector('.front-img'),`images/${valToName(card.val).toString().toLowerCase()}_of_${card.suit}.png`,`${valToName(card.val).toString()} of ${card.suit}`);
    card.domElement = clone;
}

export const stackCards = function(cardContainer) {
    let cards = cardContainer.querySelectorAll('.card');

    cards.forEach((card,i) => {
        card.style.zIndex = `${i}`;
        card.style.bottom = `${i * cardSeparation}px`;
})};

export const getElementX = function(element) {
    return element.getBoundingClientRect().left;
}

export const getElementY = function(element) {
    return element.getBoundingClientRect().top;
}

export const getDistanceX = function(startElement,endElement) {
    return getElementX(endElement) - getElementX(startElement);
}

export const getDistanceY = function(startElement,endElement) {
    return getElementY(endElement) - getElementY(startElement);
} 

export const animate = function(domElement, cssClass, animationTime, backgroundFunction) {
    domElement.classList.add(cssClass);
    setTimeout(() => {
        backgroundFunction();
        domElement.classList.remove(cssClass);
    }, animationTime);
}

export const shiftUp = function(domElement) {
    domElement.style.bottom = `${Number(domElement.style.bottom.split('px')[0].trim()) + cardSeparation}px`;
}

export const shiftCardsUp = function(cardContainer) {
    let cardDomElements = cardContainer.querySelectorAll('.card');
    cardDomElements.forEach(cardDomElement => shiftUp(cardDomElement));
};

export const disableButton = function() {
    $draw.disabled = 'disabled';
    setTimeout(() => $draw.disabled = '', moveTime + resultTime);
}