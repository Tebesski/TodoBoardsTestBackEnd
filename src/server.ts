import app from "./app"

const isDevelopment = process.env.NODE_ENV === "development"
const PORT = isDevelopment ? 9000 : process.env.PORT

app.listen(PORT, () => {
   console.log(`Server is running on PORT :${PORT}`)
})
