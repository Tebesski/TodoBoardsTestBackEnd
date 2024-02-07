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
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { boardName } = req.body;
        const newBoardId = (0, uuid_1.v4)();
        yield database_1.pool.query("INSERT INTO boards_list (id, board_name) VALUES ($1, $2)", [newBoardId, boardName]);
        res.json({ success: true, boardId: newBoardId });
    }
    catch (error) {
        console.error("Error creating new board:", error);
        res.status(500).json({
            success: false,
            error: "Error creating new board",
        });
    }
}));
// DELETE A BOARD
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Start a transaction
        yield database_1.pool.query("BEGIN");
        // Delete the cards associated with the board
        yield database_1.pool.query("DELETE FROM boards_list_cards WHERE board_id = $1", [
            id,
        ]);
        // Delete the board from the database
        yield database_1.pool.query("DELETE FROM boards_list WHERE id = $1", [id]);
        // Commit the transaction
        yield database_1.pool.query("COMMIT");
        // Send success response
        res.json({ success: true });
    }
    catch (error) {
        // If an error occurs, rollback the transaction
        yield database_1.pool.query("ROLLBACK");
        console.error("Error deleting board:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
// EDIT A BOARD
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { boardName } = req.body;
        // Check if the board with the given ID exists
        const existingBoard = yield database_1.pool.query("SELECT * FROM boards_list WHERE id = $1", [id]);
        if (existingBoard.rows.length === 0) {
            return res.status(404).json({ error: "Board not found" });
        }
        // Update the board title
        yield database_1.pool.query("UPDATE boards_list SET board_name = $1 WHERE id = $2", [
            boardName,
            id,
        ]);
        // Send success response
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error updating board title:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
// GET ALL BOARDS
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query("SELECT * FROM boards_list");
        const boards = result.rows;
        res.json(boards);
    }
    catch (error) {
        console.error("Error fetching boards:", error);
        res.status(500).json({ error: "Error fetching boards" });
    }
}));
exports.default = router;
