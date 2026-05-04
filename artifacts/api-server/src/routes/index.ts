import { Router, type IRouter } from "express";
import healthRouter from "./health";
import customRouter from "./custom";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/custom", customRouter);

export default router;
