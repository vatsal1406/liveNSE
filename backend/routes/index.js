import { Router } from "express";
import newsroutes from "./news.routes.js";

const router = Router();

router.use("/news", newsroutes);

export default router;