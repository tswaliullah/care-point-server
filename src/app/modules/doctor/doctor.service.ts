import { prisma } from "../../shared/prisma";
import { Doctor, Prisma } from "../../../generated/client";
import { paginationHelper } from "../../shared/pagination";
import { doctorSearchableFields } from "./doctor.constant";

const getAllDoctorFromDB = async (filters: any, options: any) => {

    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.pagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andConditions.push(...filterConditions);
    }

    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    })

    const total = await prisma.doctor.count({
        where: whereConditions
    })

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    }
}


const updateDoctorProfile = async (id: string, payload: Partial<Doctor>) => {
    const doctorInfo = await prisma.doctor.findFirstOrThrow({
        where: {
            id
        }
    })

    const updatedData = await prisma.doctor.update({
        where: {
            id: doctorInfo.id
        },
        data: payload
    })

    return updatedData

}

export const DoctorServices = {
    getAllDoctorFromDB,
    updateDoctorProfile
}
