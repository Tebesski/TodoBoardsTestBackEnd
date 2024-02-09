import express from "express"
import boardsController from "../controllers/boardsController"

const router = express.Router()

// ADD NEW BOARD
router.post("/boards", boardsController.addNewBoard)

// DELETE A BOARD
router.delete("/boards/:id", boardsController.deleteBoard)

// EDIT A BOARD
router.patch("/boards/:id", boardsController.editBoard)

// GET ALL BOARDS
router.get("/boards", boardsController.getAllBoards)

export default router
