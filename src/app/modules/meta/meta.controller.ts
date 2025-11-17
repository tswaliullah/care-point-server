import { Request, Response } from "express";
import { MetaService } from "./meta.service";
import { IJWTPayload } from "../../types/common";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { prisma } from "../../shared/prisma";

const fetchDashboardMetaData = catchAsync( async(req: Request & {user?: IJWTPayload}, res: Response) => {
    
    const user = req.user as IJWTPayload;
    const result = await MetaService.fetchDashboardMetaData(user);

        sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meta data fetched successfuly..!",
        data: result
    })
})



const getAdminMetaData = async() => {
    const patientData = await prisma.patient.count();
    const doctorData = await prisma.doctor.count();
    const adminData = await prisma.admin.count();
}



export const MetaController = {
fetchDashboardMetaData
}