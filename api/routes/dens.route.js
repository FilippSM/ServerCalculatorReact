import express from "express";
import { getAllDens, getDens, postDens } from "../controllers/dens.controller";

const router = express.Router();

//пример
//все таски
router.get("/", getAllDens);

//get one data on query parameters
router.get("/query", getDens);

//create one data
router.post("/", postDens);

export default router;
