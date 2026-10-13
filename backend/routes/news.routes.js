import { Router } from "express";
import { getNews,searchNews,getOneNews,getNewsById } from "../controllers/news.controller.js";

const router = Router();

router.get("/latest", getNews);
router.get("/one",getOneNews);
router.get("/search",searchNews);
router.get("/:id",getNewsById);
export default router;
