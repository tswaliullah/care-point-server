import { IJWTPayload } from "../../types/common";
import { UserRole } from "../../../generated/enums";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";

const fetchDashboardMetaData = async(user: IJWTPayload) => {

    let metaData;
    switch (user.role) {
        case UserRole.PATIENT:
            metaData = "Patient Data";
            break;
        case UserRole.DOCTOR:
             metaData = "Doctor Data";
            break;
        case UserRole.ADMIN:
             metaData = "Admin Data";
            break;
        default:
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user role")
    }

    return metaData
}

export const MetaService = {
    fetchDashboardMetaData
}