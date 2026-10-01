import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import recordRoutes from "./recordRoutes.js";

const router = Router();

// Mount sub-routes
router.use("/", healthRoutes);
router.use("/records", recordRoutes);

export default router;
