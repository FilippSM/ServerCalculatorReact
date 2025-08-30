import express from "express"
import cors from "cors"
import router from "./api/routes/dens.route.js"

const app = express()
const PORT = 3000

// Включаем CORS для всех роутов
app.use(
  cors({
    origin: "*", //все домены
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  }),
)

app.use(express.json())
app.use("/static", express.static("public"))

app.get("/", (req, res) => {
  res.json({ message: "Deploy on server" })
})

app.use("/dens", router)

//отрабатывает если не один роутер не сработал
app.use((req, res) => {
  res.status(404).json({ error: "Nothing found" })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
