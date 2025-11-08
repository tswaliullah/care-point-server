import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import pick from "../../shared/pick";
import { IJWTPayload } from "../../types/common";



const insertIntoDB = catchAsync(async (req: Request, res: Response) => {

    const result = await ScheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule Created successfuly..!",
        data: result
    })
});


const scheduleForDoctor = catchAsync(async (req: Request & {user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]); // pagination and sorting
    const filters = pick(req.query, ["startDateTime", "endDateTime"]);
    const user = req.user;
    const result = await ScheduleService.scheduleForDoctor(user as IJWTPayload, filters, options)

     sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule retreivs successfuly..!",
        meta: result.meta,
        data: result.data
    })
})


const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {

    const result = await ScheduleService.deleteScheduleFromDB(req.params.id)

     sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule delete successfuly..!",
        data: result
    })
})


export const ScheduleController = {
    insertIntoDB,
    scheduleForDoctor,
    deleteScheduleFromDB
}