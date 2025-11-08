import httpStatus from "http-status"
import { Prisma } from "../../generated/client";
import { NextFunction, Request, Response } from "express"

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code == "P2002") {
            message = "Duplicate key error",
            error = err.meta,
            statusCode = httpStatus.CONFLICT
        } 

        if (err.code == "P1000") {
            message = "Authentication failed against database server",
            error = err.meta,
            statusCode = httpStatus.BAD_GATEWAY
        }
        
        if (err.code == "P2012") {
            message = "Missing a required valuer",
            error = err.meta,
            statusCode = httpStatus.BAD_REQUEST
        }
    }

    else if(err instanceof Prisma.PrismaClientValidationError) {
        message= "Validation Error",
        err= err.message,
         statusCode = httpStatus.BAD_REQUEST
    }

    else if(err instanceof Prisma.PrismaClientUnknownRequestError) {
        message= "Unknown Prisma error occured",
        err= err.message,
         statusCode = httpStatus.BAD_REQUEST
    }

    else if(err instanceof Prisma.PrismaClientInitializationError) {
        message= "Prisma failed to initialize..!",
        err= err.message,
         statusCode = httpStatus.BAD_REQUEST
    }

    res.status(statusCode).json({
        success,
        message,
        error
    })
};

export default globalErrorHandler;