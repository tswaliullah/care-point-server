import { prescriptionService } from "./prescription.service";
import { IJWTPayload } from "../../types/common";
import { Response } from 'express';
import { Request } from 'express';
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import httpStatus from 'http-status';
import pick from "../../shared/pick";

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



const patientPrescription = catchAsync(async(req: Request & {user?: IJWTPayload}, res: Response) => {

    const user = req.user;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await prescriptionService.patientPrescription(user as IJWTPayload, options);

     sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Prescription retrive successfuly..!",
        meta: result.meta,
        data: result.data
    })
})


export const PrescriptionController = {
    createPrescription,
    patientPrescription
}