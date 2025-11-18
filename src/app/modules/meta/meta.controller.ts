import { Request, Response } from "express";
import { PaymentStatus } from "../../../generated/enums";
import { MetaService } from "./meta.service";
import { IJWTPayload } from "../../types/common";
import { prisma } from "../../shared/prisma";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";

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



export const MetaController = {
fetchDashboardMetaData
}