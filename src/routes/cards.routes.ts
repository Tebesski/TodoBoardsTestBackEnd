import express from "express"
import { v4 as uuidv4 } from "uuid"
import { pool } from "../database"

const router = express.Router()

router.get("/cards", async (req, res) => {
   try {
      const result = await pool.query("SELECT * FROM cards")
      const cards = result.rows

      res.json(cards)
   } catch (error) {
      console.error("Error creating new board:", error)
      res.status(500).json({
         success: false,
         error: "Error creating new board",
      })
   }
})

// GET CARD BY ID:
router.get("/cards/:id", async (req, res) => {
   try {
      const { id } = req.params

      // Fetch the card from the database using the provided ID
      const card = await pool.query("SELECT * FROM cards WHERE id = $1", [id])

      if (card.rows.length === 0) {
         return res.status(404).json({ error: "Card not found" })
      }

      // Send the card data in the response
      res.json(card.rows[0])
   } catch (error) {
      console.error("Error fetching card:", error)
      res.status(500).json({ error: "Internal server error" })
   }
})

// ADD NEW CARD:
router.post("/cards", async (req, res) => {
   try {
      const { title, content, status, board_id } = req.body
      const id = uuidv4()
      await pool.query(
         "INSERT INTO cards (id, title, content, status) VALUES ($1, $2, $3, $4)",
         [id, title, content, status]
      )
      await pool.query(
         "INSERT INTO boards_list_cards (board_id, card_id) VALUES ($1, $2)",
         [board_id, id]
      )
      res.status(201).json({ id, title, content, status })
   } catch (error) {
      console.error("Error adding card:", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
})

// EDIT CARD TITLE
router.patch("/cards/:id/title", async (req, res) => {
   try {
      const { id } = req.params
      const { title } = req.body

      // Update the title of the card in the database
      await pool.query("UPDATE cards SET title = $1 WHERE id = $2", [title, id])

      // Respond with the updated card data
      res.json({ message: "Card title updated successfully" })
   } catch (error) {
      console.error("Error updating card title:", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
})

// CHANGE CARD STATUS
router.patch("/cards/:id/status", async (req, res) => {
   try {
      const { id } = req.params
      const { status } = req.body

      await pool.query("UPDATE cards SET status = $1 WHERE id = $2", [
         status,
         id,
      ])

      res.json({ message: "Card status updated successfully" })
   } catch (error) {
      console.error("Error updating card status:", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
})

// EDIT CARD CONTENT
router.patch("/cards/:id/content", async (req, res) => {
   try {
      const { id } = req.params
      const { content } = req.body

      // Update the card record in the database
      await pool.query("UPDATE cards SET content = $1 WHERE id = $2", [
         content,
         id,
      ])

      res.json({ message: "Card updated successfully" })
   } catch (error) {
      console.error("Error updating card:", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
})

// GET CARDS FOR SPECIFIC BOARD
router.get("/boards/:boardId/cards", async (req, res) => {
   try {
      const { boardId } = req.params
      const { rows } = await pool.query(
         "SELECT cards.* FROM cards JOIN boards_list_cards ON cards.id = boards_list_cards.card_id WHERE boards_list_cards.board_id = $1",
         [boardId]
      )
      res.json(rows)
   } catch (error) {
      console.error("Error fetching cards:", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
})

// COUNT CARDS FOR SPECIFIC BOARD
router.get("/boards/:boardId/cards-count", async (req, res) => {
   try {
      const { boardId } = req.params
      const cardsCountByBoard = await pool.query(
         "SELECT COUNT(*) AS cards_count FROM boards_list_cards WHERE board_id = $1",
         [boardId]
      )
      res.json(cardsCountByBoard.rows[0])
   } catch (error) {
      console.error("Error fetching cards count by board:", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
})

// DELETE A CARD
router.delete("/boards/:boardId/cards/:cardId", async (req, res) => {
   try {
      const { boardId, cardId } = req.params

      // First, delete the record from the boards_list_cards table
      await pool.query(
         "DELETE FROM boards_list_cards WHERE board_id = $1 AND card_id = $2",
         [boardId, cardId]
      )

      // Then, delete the card from the cards table
      await pool.query("DELETE FROM cards WHERE id = $1", [cardId])

      res.json({ message: "Card removed from the board successfully" })
   } catch (error) {
      console.error("Error removing card from board:", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
})

export default router
