import express from "express"
import { v4 as uuidv4 } from "uuid"
import { pool } from "../database"

const router = express.Router()

router.post("/boards", async (req, res) => {
   try {
      const { boardName } = req.body
      const newBoardId = uuidv4()
      await pool.query(
         "INSERT INTO boards_list (id, board_name) VALUES ($1, $2)",
         [newBoardId, boardName]
      )

      res.json({ success: true, boardId: newBoardId })
   } catch (error) {
      console.error("Error creating new board:", error)
      res.status(500).json({
         success: false,
         error: "Error creating new board",
      })
   }
})

// DELETE A BOARD
router.delete("/boards/:id", async (req, res) => {
   try {
      const { id } = req.params

      // Start a transaction
      await pool.query("BEGIN")

      // Delete the cards associated with the board
      await pool.query("DELETE FROM boards_list_cards WHERE board_id = $1", [
         id,
      ])

      // Delete the board from the database
      await pool.query("DELETE FROM boards_list WHERE id = $1", [id])

      // Commit the transaction
      await pool.query("COMMIT")

      // Send success response
      res.json({ success: true })
   } catch (error) {
      // If an error occurs, rollback the transaction
      await pool.query("ROLLBACK")

      console.error("Error deleting board:", error)
      res.status(500).json({ error: "Internal server error" })
   }
})

// EDIT A BOARD
router.patch("/boards/:id", async (req, res) => {
   try {
      const { id } = req.params
      const { boardName } = req.body

      // Check if the board with the given ID exists
      const existingBoard = await pool.query(
         "SELECT * FROM boards_list WHERE id = $1",
         [id]
      )

      if (existingBoard.rows.length === 0) {
         return res.status(404).json({ error: "Board not found" })
      }

      // Update the board title
      await pool.query("UPDATE boards_list SET board_name = $1 WHERE id = $2", [
         boardName,
         id,
      ])

      // Send success response
      res.json({ success: true })
   } catch (error) {
      console.error("Error updating board title:", error)
      res.status(500).json({ error: "Internal server error" })
   }
})

// GET ALL BOARDS
router.get("/boards", async (_req, res) => {
   try {
      const result = await pool.query("SELECT * FROM boards_list")
      const boards = result.rows

      res.json(boards)
   } catch (error) {
      console.error("Error fetching boards:", error)
      res.status(500).json({ error: "Error fetching boards" })
   }
})

export default router
