import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"
import boardsRoutes from "./routes/boards.routes"
import cardsRoutes from "./routes/cards.routes"

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(morgan("dev"))

app.use("/api", boardsRoutes)
app.use("/api", cardsRoutes)

export default app
