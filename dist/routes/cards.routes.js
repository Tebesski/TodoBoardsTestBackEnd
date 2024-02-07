"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const database_1 = require("../database");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query("SELECT * FROM cards");
        const cards = result.rows;
        res.json(cards);
    }
    catch (error) {
        console.error("Error creating new board:", error);
        res.status(500).json({
            success: false,
            error: "Error creating new board",
        });
    }
}));
// GET CARD BY ID:
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Fetch the card from the database using the provided ID
        const card = yield database_1.pool.query("SELECT * FROM cards WHERE id = $1", [id]);
        if (card.rows.length === 0) {
            return res.status(404).json({ error: "Card not found" });
        }
        // Send the card data in the response
        res.json(card.rows[0]);
    }
    catch (error) {
        console.error("Error fetching card:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
// ADD NEW CARD:
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, status, board_id } = req.body;
        const id = (0, uuid_1.v4)();
        yield database_1.pool.query("INSERT INTO cards (id, title, content, status) VALUES ($1, $2, $3, $4)", [id, title, content, status]);
        yield database_1.pool.query("INSERT INTO boards_list_cards (board_id, card_id) VALUES ($1, $2)", [board_id, id]);
        res.status(201).json({ id, title, content, status });
    }
    catch (error) {
        console.error("Error adding card:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// EDIT CARD TITLE
router.patch("/:id/title", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title } = req.body;
        // Update the title of the card in the database
        yield database_1.pool.query("UPDATE cards SET title = $1 WHERE id = $2", [title, id]);
        // Respond with the updated card data
        res.json({ message: "Card title updated successfully" });
    }
    catch (error) {
        console.error("Error updating card title:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// CHANGE CARD STATUS
router.patch("/:id/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        yield database_1.pool.query("UPDATE cards SET status = $1 WHERE id = $2", [
            status,
            id,
        ]);
        res.json({ message: "Card status updated successfully" });
    }
    catch (error) {
        console.error("Error updating card status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// EDIT CARD CONTENT
router.patch("/:id/content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { content } = req.body;
        // Update the card record in the database
        yield database_1.pool.query("UPDATE cards SET content = $1 WHERE id = $2", [
            content,
            id,
        ]);
        res.json({ message: "Card updated successfully" });
    }
    catch (error) {
        console.error("Error updating card:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// GET CARDS FOR SPECIFIC BOARD
router.get("/:boardId/cards", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId } = req.params;
        const { rows } = yield database_1.pool.query("SELECT cards.* FROM cards JOIN boards_list_cards ON cards.id = boards_list_cards.card_id WHERE boards_list_cards.board_id = $1", [boardId]);
        res.json(rows);
    }
    catch (error) {
        console.error("Error fetching cards:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// COUNT CARDS FOR SPECIFIC BOARD
router.get("/:boardId/cards-count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId } = req.params;
        const cardsCountByBoard = yield database_1.pool.query("SELECT COUNT(*) AS cards_count FROM boards_list_cards WHERE board_id = $1", [boardId]);
        res.json(cardsCountByBoard.rows[0]);
    }
    catch (error) {
        console.error("Error fetching cards count by board:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// DELETE A CARD
router.delete("/:boardId/cards/:cardId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardId, cardId } = req.params;
        // First, delete the record from the boards_list_cards table
        yield database_1.pool.query("DELETE FROM boards_list_cards WHERE board_id = $1 AND card_id = $2", [boardId, cardId]);
        // Then, delete the card from the cards table
        yield database_1.pool.query("DELETE FROM cards WHERE id = $1", [cardId]);
        res.json({ message: "Card removed from the board successfully" });
    }
    catch (error) {
        console.error("Error removing card from board:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
