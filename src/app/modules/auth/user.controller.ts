import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./user.service";


const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User login successfully..!",
        data: result
    })

})


export const AuthController = {
    login
}