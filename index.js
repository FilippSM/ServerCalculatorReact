import express from 'express'
import cors from 'cors';
import { density } from "./public/data.js"
import { valuesDensity } from './public/bdDensity.js';

const app = express();
const PORT = 3000;

// Включаем CORS для всех роутов
app.use(cors({
  origin: "*", //все домены 
  methods: ['GET', 'POST'] 
}));



app.use(express.json())
app.use('/static', express.static('public'))

app.get('/', (req, res) => {
    res.json({ message: 'Deploy on server' })
})

//пример
app.get('/dens', (req, res) => {
    res.json({ data: density })
})


//get one data on query parameters
app.get('/dens/query', (req, res) => {
    try {
        const { density, temperature } = req.query;

        // Проверка существования значений в структуре данных
        if (!valuesDensity[density] || !valuesDensity[density][temperature]) {
            return res.status(404).json({ error: "Nothing found" });
        }

        const value = valuesDensity[density][temperature];
        res.json({ data: value });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//create one data
app.post('/dens', (req, res) => {
    const densityFor20 = req.body.density

    const newDensity = { id: density.length + 1, densityFor20 }

    density.push(newDensity)

    res.json({ data: newDensity })
})


//отрабатывает если не один роутер не сработал
app.use((req, res) => {
    res.status(404).json({ error: 'Nothing found' })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})