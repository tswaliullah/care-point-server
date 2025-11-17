import { MetaController } from "./meta.controller";
import { UserRole } from "../../../generated/enums";
import Express from "express";
import auth from "../../middlewares/auth";

const router = Express.Router()


router.get(
    "/",
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    MetaController.fetchDashboardMetaData
)



export const metaRoutes = router