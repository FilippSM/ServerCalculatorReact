import { valuesDensity } from "../bdDensity.js";
import { density } from "../data.js";

export const getAllDens = (req, res) => {
    res.json({ data: density });
};

export const getDens = (req, res) => {
    try {
        const { density, temperature } = req.query;

        // Проверка существования значений в структуре данных
        if (!valuesDensity[density] || !valuesDensity[density][temperature]) {
            return res.status(404).json({ error: "Nothing found" });
        }

        const value = valuesDensity[density][temperature];
        res.json({ data: value });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const postDens = (req, res) => {
    const densityFor20 = req.body.density;
    const newDensity = { id: density.length + 1, densityFor20 };
    density.push(newDensity);

    res.json({ data: newDensity });
};
