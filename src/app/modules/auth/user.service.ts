import { UserStatus } from "../../../generated/enums"
import { prisma } from "../../shared/prisma"
import bcrypt from 'bcryptjs';

const login = async( payload: {email: string, password: string} ) => {

    const user = await prisma.user.findFirstOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })
    
    const checkPassword = await bcrypt.compare(payload.password, user.password)

    if(!checkPassword) {
        throw new Error("Password not matched")
    }

    return "result"
}

export const AuthService = {
    login
}