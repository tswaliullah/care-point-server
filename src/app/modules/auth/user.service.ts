import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import config from "../../../config";
import { prisma } from "../../shared/prisma"
import ApiError from '../../errors/ApiError';
import { jwtHelperes } from "../../helper/jwtHelper";
import { UserStatus } from "../../../generated/enums";

const login = async (payload: { email: string, password: string }) => {

    const user = await prisma.user.findFirstOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })


    const checkPassword = await bcrypt.compare(payload.password, user.password)

    if (!checkPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password not matched")
    }

    const accessToken = jwtHelperes.generateToken({ email: user.email, role: user.role }, config.access_token_secret as string, "1h")

    const refreshToken = jwtHelperes.generateToken({ email: user.email, role: user.role }, config.refresh_token_secret as string, "90d")

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange
    }
}

export const AuthService = {
    login
}