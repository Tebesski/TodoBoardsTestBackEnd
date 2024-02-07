"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCard = exports.createBoard = exports.getAllBoards = void 0;
const boards = [];
const cards = [];
const getAllBoards = (req, res) => {
    res.json(boards);
};
exports.getAllBoards = getAllBoards;
const createBoard = (req, res) => {
    const newBoard = req.body;
    boards.push(newBoard);
    res.json(newBoard);
};
exports.createBoard = createBoard;
const addCard = (req, res) => {
    const newCard = req.body;
    cards.push(newCard);
    res.json(newCard);
};
exports.addCard = addCard;
