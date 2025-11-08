import config from "../../config";
import httpStatus from "http-status"
import ApiError from "../errors/ApiError";
import { jwtHelperes } from "../helper/jwtHelper";
import { NextFunction, Request, Response } from "express"

const auth = (...roles: string[]) => {
    return async(req: Request & {user?: any}, res: Response, next: NextFunction) => {
        try{
            const token = req.cookies.accessToken;

            if(!token) {
                throw new ApiError(httpStatus.BAD_REQUEST, "You are not authorized...")
            }

            const verifyUser = jwtHelperes.verifyToken(token, config.access_token_secret as string);
            req.user = verifyUser;

            if(roles.length && !roles.includes(verifyUser.role)){
               throw new ApiError(httpStatus.BAD_REQUEST, "You are not authorized...")
            }

            next()

        } catch(err) {
            next(err)
        }
    }
}

export default auth