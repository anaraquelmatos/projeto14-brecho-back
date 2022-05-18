import { Router } from "express";
import { rootController, deleteAccessRootController } from "../controllers/rootController.js";

const rootRouter = Router();

rootRouter.get("/", rootController);

rootRouter.delete("/:id", deleteAccessRootController);

export default rootRouter;