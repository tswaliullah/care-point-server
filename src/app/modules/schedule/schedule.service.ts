import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../shared/prisma";
import { paginationHelper } from "../../shared/pagination";
import { Prisma } from "../../../generated/client";


const insertIntoDB = async (payload: any) => {
    const { startDate, endDate, startTime, endTime } = payload;
    const intervalTime = 30;

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    const schedules = [];

    // get start date with start-time
    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0]) // 11:00
                ),
                Number(startTime.split(":")[1])
            )
        )

        // get start date with end-time
        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0]) // 11:00
                ),
                Number(endTime.split(":")[1])
            )
        )

        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime;
            const slotEndDateTime = addMinutes(startDateTime, intervalTime);


            const scheduleDate = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime
            }

            // await prisma.schedule.cre 
            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleDate
            })


            // check the schedule already existing or not
            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleDate
                })
                schedules.push(result)
            }

            // move to next slot
            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime);
        }

        // move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedules
}

const scheduleForDoctor = async (filters: any, options: any) => {

    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.pagination(options);
    const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } = filters;

    const andConditions: Prisma.ScheduleWhereInput[] = []

    if (filterStartDateTime && filterEndDateTime) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: filterStartDateTime
                    }
                },
                {
                    endDateTime: {
                        lte: filterEndDateTime
                    }
                }
            ]
        })
    }

    const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const result = await prisma.schedule.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.schedule.count({
        where: whereConditions
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result
    };
}


const deleteScheduleFromDB = async (id: string) => {
    return await prisma.schedule.delete({
        where: {
            id
        }
    })
} 

export const ScheduleService = {
    insertIntoDB,
    scheduleForDoctor,
    deleteScheduleFromDB
}