import bcrypt from "bcryptjs";
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { fileUploder } from "../../helper/fileUploder";



const createPatient = async( req: Request ) => {

 
    if(req.file){
        const fileUpload = await fileUploder.uploadToCloudinary(req.file)
        req.body.patient.profilePhoto = fileUpload?.secure_url
    }

    const hashedPass = bcrypt.hash(req.body.password, 12)

    const result = await prisma.$transaction(async( tnx ) => {
        await tnx.user.create({
            data: {
                email: req.body.patient.email,
                password: req.body.password
            }
        });

       return await tnx.patient.create({
            data: req.body.patient
        })
    })

    return result
}

export const UserService = {
    createPatient
}