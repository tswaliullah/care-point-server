import bcrypt from "bcryptjs";
import { createPatientInput } from "./user.interface";
import { prisma } from "../../shared/prisma";



const createPatient = async( payload: createPatientInput ) => {
    const hashedPass = bcrypt.hash(payload.password, 12)

    const result = await prisma.$transaction(async( tnx ) => {
        await tnx.user.create({
            data: {
                email: payload.email,
                password: payload.password
            }
        });

       return await tnx.patient.create({
            data: {
                name: payload.name,
                email: payload.email,
                address: payload.address
            }
        })

    })

    return result

}

export const UserService = {
    createPatient
}