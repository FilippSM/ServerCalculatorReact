import "dotenv/config"
import { app } from "./app.js"

/**
 * Точка входа: только listen.
 * Entry point: listen only.
 */
const PORT = Number(process.env.PORT) || 5000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
