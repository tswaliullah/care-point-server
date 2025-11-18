import express from "express"
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/enums";
import { AppoinmentControllers } from "./appoinment.controller";

const router = express.Router()



router.get(
    "/my-appoinment",
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppoinmentControllers.getMyAppoinment
)

router.get(
    '/',
    auth(UserRole.ADMIN),
    AppoinmentControllers.getAllFromDB
);

router.post(
    "/",
    auth(UserRole.PATIENT),
    AppoinmentControllers.createAppoinment
)


router.patch(
    "/status/:id",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    AppoinmentControllers.updateAppointmentStatus
)



export const appoinmentRoutes = router;