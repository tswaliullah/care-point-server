import express from "express"
import { ScheduleController } from "./schedule.controller";

const router = express.Router()



router.get(
    "/",
    ScheduleController.scheduleForDoctor
)

router.post(
    "/",   
    ScheduleController.insertIntoDB
)


router.delete(
    "/:id",   
    ScheduleController.deleteScheduleFromDB
)



export const scheduleRoutes = router;
