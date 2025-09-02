import { getAllAuth, postAuth } from "../controllers/auth.controller.js"
import express from "express"

const authRouter = express.Router()

//пример
//все таски
authRouter.get("/", getAllAuth)

//create one data
authRouter.post("/", postAuth)



export default authRouter
