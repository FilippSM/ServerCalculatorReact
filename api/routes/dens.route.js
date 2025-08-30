import express from "express"
import { deleteDens, getAllDens, getDens, postDens } from "../controllers/dens.controller.js"

const router = express.Router()

//пример
//все таски
router.get("/", getAllDens)

//get one data on query parameters
router.get("/query", getDens)

//create one data
router.post("/", postDens)

//delete dens
router.delete("/:id", deleteDens)

export default router
