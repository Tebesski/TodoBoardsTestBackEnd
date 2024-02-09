import { pool } from "../database"
import { v4 as uuidv4 } from "uuid"

async function getAllCards() {
   const cards = await pool.query("SELECT * FROM cards")
   return cards.rows
}

async function getCardById(id: string) {
   const card = await pool.query("SELECT * FROM cards WHERE id = $1", [id])
   return card.rows[0]
}

async function addNewCard(
   title: string,
   content: string,
   status: string,
   board_id: string
) {
   const id = uuidv4()
   await pool.query(
      "INSERT INTO cards (id, title, content, status) VALUES ($1, $2, $3, $4)",
      [id, title, content, status]
   )
   await pool.query(
      "INSERT INTO boards_list_cards (board_id, card_id) VALUES ($1, $2)",
      [board_id, id]
   )
   return { id, title, content, status }
}

async function editCardTitle(id: string, title: string) {
   await pool.query("UPDATE cards SET title = $1 WHERE id = $2", [title, id])
}

async function editCardContent(id: string, content: string) {
   await pool.query("UPDATE cards SET content = $1 WHERE id = $2", [
      content,
      id,
   ])
}

async function getCardsByBoardId(boardId: string) {
   const { rows } = await pool.query(
      "SELECT cards.* FROM cards JOIN boards_list_cards ON cards.id = boards_list_cards.card_id WHERE boards_list_cards.board_id = $1",
      [boardId]
   )

   return rows
}

async function changeCardStatus(id: string, status: string) {
   await pool.query("UPDATE cards SET status = $1 WHERE id = $1", [status, id])
}

async function countCardsByBoardId(boardId: string) {
   const { rows } = await pool.query(
      "SELECT COUNT(*) FROM boards_list_cards WHERE board_id = $1",
      [boardId]
   )

   return parseInt(rows[0].count)
}

async function deleteCard(boardId: string, cardId: string) {
   await pool.query(
      "DELETE FROM boards_list_cards WHERE board_id = $1 AND card_id = $2",
      [boardId, cardId]
   )

   await pool.query("DELETE FROM cards WHERE id = $1", [cardId])
}

export default {
   getAllCards,
   getCardById,
   addNewCard,
   editCardTitle,
   changeCardStatus,
   editCardContent,
   getCardsByBoardId,
   countCardsByBoardId,
   deleteCard,
}
