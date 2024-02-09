import { Request, Response } from "express"
import boardsServices from "../services/boardsServices"

async function getAllBoards(req: Request, res: Response) {
   try {
      const boards = boardsServices.getAllBoards()
      res.json(boards)
   } catch (error) {
      console.error("Error getting all boards:", error)
      res.status(500).json({
         success: false,
         error: "Error getting all boards",
      })
   }
}

async function editBoard(req: Request, res: Response) {
   try {
      const { id } = req.params
      const { boardName } = req.body

      if (!id || !boardName) {
         return res
            .status(400)
            .json({ error: "Board ID and name are required" })
      }

      const existingBoard = await boardsServices.editBoard(id, boardName)
      if (!existingBoard) {
         return res.status(404).json({ error: "Board not found" })
      }

      res.json({ success: true })
   } catch (error) {
      console.error("Error editing board:", error)
      res.status(500).json({ error: "Error editing board" })
   }
}

async function deleteBoard(req: Request, res: Response) {
   try {
      const { id } = req.params

      if (!id) {
         return res.status(400).json({ error: "Board ID is required" })
      }

      await boardsServices.deleteBoard(id)

      res.json({ success: true })
   } catch (error) {
      console.error("Error deleting board:", error)
      res.status(500).json({ error: "Internal server error" })
   }
}

async function addNewBoard(req: Request, res: Response) {
   try {
      const { boardName } = req.body

      if (!boardName) {
         return res.status(400).json({ error: "Board name is required" })
      }

      await boardsServices.addNewBoard(boardName)
      res.json({ success: true })
   } catch (error) {
      console.error("Error creating new board:", error)
      res.status(500).json({
         success: false,
         error: "Error creating new board",
      })
   }
}

export default {
   getAllBoards,
   editBoard,
   deleteBoard,
   addNewBoard,
}
