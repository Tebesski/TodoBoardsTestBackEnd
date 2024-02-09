import express from "express"
import cardsController from "../controllers/cardsController"

const router = express.Router()

router.get("/cards", cardsController.getAllCards)

// GET CARD BY ID:
router.get("/cards/:id", cardsController.getCardById)

// ADD NEW CARD:
router.post("/cards", cardsController.addNewCard)

// EDIT CARD TITLE
router.patch("/cards/:id/title", cardsController.editCardTitle)

// CHANGE CARD STATUS
router.patch("/cards/:id/status", cardsController.changeCardStatus)

// EDIT CARD CONTENT
router.patch("/cards/:id/content", cardsController.editCardContent)

// GET CARDS FOR SPECIFIC BOARD
router.get("/boards/:boardId/cards", cardsController.getCardsByBoardId)

// COUNT CARDS FOR SPECIFIC BOARD
router.get("/boards/:boardId/cards-count", cardsController.countCardsByBoardId)

// DELETE A CARD
router.delete("/boards/:boardId/cards/:cardId", cardsController.deleteCard)

export default router
