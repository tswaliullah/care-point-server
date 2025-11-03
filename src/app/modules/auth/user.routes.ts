import express from "express"
import { AuthController } from "./user.controller";


const router = express.Router()

router.post(
    "/login",
    AuthController.login
)

export const authRoutes = router;
 