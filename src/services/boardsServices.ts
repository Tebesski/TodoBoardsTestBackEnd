import { pool } from "../database"
import { v4 as uuidv4 } from "uuid"

async function getAllBoards() {
   const result = await pool.query("SELECT * FROM boards_list")
   const boards = result.rows

   return boards
}

async function editBoard(id: string, boardName: string) {
   const existingBoard = await pool.query(
      "SELECT * FROM boards_list WHERE id = $1",
      [id]
   )

   await pool.query("UPDATE boards_list SET board_name = $1 WHERE id = $2", [
      boardName,
      id,
   ])

   return existingBoard.rows
}

async function deleteBoard(id: string) {
   await pool.query("BEGIN")
   await pool.query("DELETE FROM boards_list_cards WHERE board_id = $1", [id])
   await pool.query("DELETE FROM boards_list WHERE id = $1", [id])
   await pool.query("COMMIT")
}

async function addNewBoard(boardName: string) {
   const newBoardId = uuidv4()
   await pool.query(
      "INSERT INTO boards_list (id, board_name) VALUES ($1, $2)",
      [newBoardId, boardName]
   )
}

export default {
   getAllBoards,
   editBoard,
   deleteBoard,
   addNewBoard,
}
