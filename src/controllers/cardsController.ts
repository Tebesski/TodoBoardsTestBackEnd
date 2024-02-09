import { Request, Response } from "express"
import cardsServices from "../services/cardsServices"

// GET ALL CARDS
async function getAllCards(_req: Request, res: Response) {
   try {
      const cards = await cardsServices.getAllCards()
      res.json(cards)
   } catch (error) {
      console.error("Error fetching all cards: ", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
}

async function getCardById(req: Request, res: Response) {
   try {
      const { id } = req.params

      if (!id) return res.status(400).json({ error: "Card ID is required" })

      const card = await cardsServices.getCardById(id)

      if (card === undefined) {
         return res.status(404).json({ error: "Card not found" })
      }

      res.json(card)
   } catch (error) {
      console.error("Error fetching card: ", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
}

// ADD AND CREATE CARD
async function addNewCard(req: Request, res: Response) {
   try {
      const { title, content, status, board_id } = req.body

      if (!title || !content || !status || !board_id) {
         return res.status(400).json({ error: "Missing required fields" })
      }

      const card = await cardsServices.addNewCard(
         title,
         content,
         status,
         board_id
      )
      res.status(201).json(card)
   } catch (error) {
      console.error("Error adding card: ", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
}

async function editCardTitle(req: Request, res: Response) {
   try {
      const { id } = req.params
      const { title } = req.body

      if (!title) return res.status(400).json({ error: "Title is required" })
      if (!id) return res.status(400).json({ error: "Card ID is required" })

      await cardsServices.editCardTitle(id, title)
      res.json({ message: "Card title updated successfully" })
   } catch (error) {
      console.error("Error updating card title: ", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
}

async function editCardContent(req: Request, res: Response) {
   try {
      const { id } = req.params
      const { content } = req.body

      if (!content)
         return res.status(400).json({ error: "Content is required" })
      if (!id) return res.status(400).json({ error: "Card ID is required" })

      await cardsServices.editCardContent(id, content)
      res.json({ message: "Card content updated successfully" })
   } catch (error) {
      console.error("Erorr updating card's content: ", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
}

async function changeCardStatus(req: Request, res: Response) {
   try {
      const { id } = req.params
      const { status } = req.body

      if (!status) return res.status(400).json({ error: "Status is required" })
      if (!id) return res.status(400).json({ error: "Card ID is required" })

      await cardsServices.changeCardStatus(id, status)

      res.json({ message: "Card status updated successfully" })
   } catch (error) {
      console.error("Error updating card's status: ", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
}

async function getCardsByBoardId(req: Request, res: Response) {
   try {
      const { boardId } = req.params
      if (!boardId)
         return res.status(400).json({ error: "Board ID is required" })
      const rows = await cardsServices.getCardsByBoardId(boardId)
      res.json(rows)
   } catch (error) {
      console.error("Error fetching cards: ", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
}

async function countCardsByBoardId(req: Request, res: Response) {
   try {
      const { boardId } = req.params
      if (!boardId)
         return res.status(400).json({ error: "Board ID is required" })

      const cardsCountByBoardId = await cardsServices.countCardsByBoardId(
         boardId
      )

      res.json(cardsCountByBoardId)
   } catch (error) {
      console.error("Error counting cards: ", error)
      res.status(500).json({ error: "Internal Server Error" })
   }
}

async function deleteCard(req: Request, res: Response) {
   const { boardId, cardId } = req.params

   if (!boardId || !cardId) {
      return res
         .status(400)
         .json({ error: "Board ID and Card ID are required" })
   }

   await cardsServices.deleteCard(boardId, cardId)

   res.json({ message: "Card removed from the board successfully" })
}

export default {
   addNewCard,
   getCardById,
   editCardTitle,
   editCardContent,
   changeCardStatus,
   getCardsByBoardId,
   countCardsByBoardId,
   deleteCard,
   getAllCards,
}
