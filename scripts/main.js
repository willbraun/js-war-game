import { Game } from './game.js';

export const $display = document.querySelector('.display');
export const $p1Name = document.querySelector('.player1-name-input');
export const $p2Name = document.querySelector('.player2-name-input');
export const $draw = document.querySelector('.draw');
export const $p1Card = document.querySelector('.p1Card');
export const $p2Card = document.querySelector('.p2Card');
export const $p1Deck = document.querySelector('.p1Deck');
export const $p2Deck = document.querySelector('.p2Deck');
export const $cardPot = document.querySelector('.cardPot');
export const $cardTemplate = document.querySelector('.card-template');

export const cardSeparation = 4;
export const startTime = 1000;
export const moveTime = 500;
export const resultTime = 500;
export const warTime = 1000;

export const game = new Game();

game.startGame.call(game);

$draw.addEventListener('click', game.draw.bind(game));
$p1Name.addEventListener('blur', game.player1.updateName.bind(game.player1));
$p2Name.addEventListener('blur', game.player2.updateName.bind(game.player2));