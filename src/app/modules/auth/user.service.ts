import { UserStatus } from "../../../generated/enums"
import { prisma } from "../../shared/prisma"
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const login = async( payload: {email: string, password: string} ) => {

    const user = await prisma.user.findFirstOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })
    
    console.log("auth", payload.password, user.password)
    const checkPassword = await bcrypt.compare(payload.password, user.password)
    console.log("auth", checkPassword)

    if(!checkPassword) {
        throw new Error("Password not matched")
    }

    const accessToken = jwt.sign({email: user.email, role: user.role}, 'jwt-secret-key', {
        algorithm: "HS256",
        expiresIn: "1h"
    })

    const refreshToken = jwt.sign({email: user.email, role: user.role}, 'jwt-secret-key', {
        algorithm: "HS256",
        expiresIn: "1h"
    })

    return {
        accessToken,
        refreshToken
    }
}

export const AuthService = {
    login
}