import { AppoinmentStatus, PaymentStatus, UserRole } from "../../../generated/enums"
import { IJWTPayload } from "../../types/common"
import { prisma } from "../../shared/prisma"
import httpStatus from 'http-status';
import ApiError from "../../errors/ApiError"

const createPrescription = async(user: IJWTPayload, payload: any) => {
    const appoinmentData = await prisma.appoinment.findFirstOrThrow({
        where: {
            id: payload.payload,
            status: AppoinmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    })   
    
    if(user.role === UserRole.DOCTOR) {
        if (!(user.email === appoinmentData.doctor.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appoinment");
        }
    }

    const result = await prisma.prescription.create({
        data: {
            appoinmentId: appoinmentData.id,
            doctorId: appoinmentData.doctorId,
            patientId: appoinmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate || null
        },
        include: {
            patient: true
        }
    })
    
    return result;
}


export const prescriptionService = {
    createPrescription
}