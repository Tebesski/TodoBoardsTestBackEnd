"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCard = exports.getAllCards = void 0;
const cards = [];
const getAllCards = (req, res) => {
    res.json(cards);
};
exports.getAllCards = getAllCards;
const createCard = (req, res) => {
    const newCard = req.body;
    cards.push(newCard);
    res.json(newCard);
};
exports.createCard = createCard;
