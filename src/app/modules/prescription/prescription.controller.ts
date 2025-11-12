import catchAsync from "../../shared/catchAsync";
import { Request } from 'express';
import { Response } from 'express';
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import { IJWTPayload } from "../../types/common";
import { prescriptionService } from "./prescription.service";


const createPrescription = catchAsync(async(req: Request & {user?: IJWTPayload}, res: Response) => {

    const user = req.user;
    const result = await prescriptionService.createPrescription(user as IJWTPayload, req.body)

     sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Prescription created successfuly..!",
        data: 'result'
    })
})