import status from "http-status";
import { Request, Response } from "express";
import { AuthService } from "./user.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";


const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body)

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "User login successfully..!",
        data: result
    })

})


export const AuthController = {
    login
}