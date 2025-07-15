import express from 'express'
import { tasks } from "./public/data.js"

const app = express();
const PORT = 3000;

app.use(express.json())
app.use('/static', express.static('public'))

app.get('/', (req, res) => {
    res.json({ message: 'Deploy on server' })
})

app.get('/tasks', (req, res) => {
    res.json({ data: tasks })
})

app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10)

    const task = tasks.find(task => task.id === taskId)

    if (task) {
        res.json({ data: task })
    } else {
        res.status(404).json({ error: "Nothing found" })
    }
})

app.post('/tasks', (req, res) => {
    const title = req.body.title

    const newTask = { id: tasks.length + 1, title }

    tasks.push(newTask)

    res.json({ data: newTask })
})

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10)

    const taskIndex = tasks.findIndex(task => task.id === taskId)

    if (taskIndex !== -1) {
        tasks[taskIndex].title = req.body.title
        res.json(tasks[taskIndex])
    } else {
        res.status(404).json({ error: "Task not found" })
    }
})

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id, 10)

    const taskIndex = tasks.findIndex(task => task.id === taskId)

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1)
        res.status(204).json({data: {id: taskId}})
    } else {
        res.status(404).json({ error: "Task not found" })
    }
})

//отрабатывает если не один роутер не сработал
app.use((req, res) => {
    res.status(404).json({error: 'Nothing found'})
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})