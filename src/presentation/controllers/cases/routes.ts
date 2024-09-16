import { Router } from "express";
import { CaseController } from "./controller";

export class CaseRoutes{
    static get routes() : Router{
        const router = Router();
        const controller = new CaseController();

        router.get("/", controller.getCases);

        router.post("/", controller.createCase);

        router.get("/last_week", controller.getCasesFromLastWeek);

        router.put("/:id", controller.updateCase);

        router.delete("/:id", controller.deleteCase);
        
        return router
    }
}