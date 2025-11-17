import { Request, Response } from "express";
import { PaymentStatus } from "../../../generated/enums";
import { MetaService } from "./meta.service";
import { IJWTPayload } from "../../types/common";
import { prisma } from "../../shared/prisma";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";

const fetchDashboardMetaData = catchAsync( async(req: Request & {user?: IJWTPayload}, res: Response) => {
    
    const user = req.user as IJWTPayload;
    const result = await MetaService.fetchDashboardMetaData(user);

        sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meta data fetched successfuly..!",
        data: result
    })
})



const getAdminMetaData = async() => {
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    const adminCount = await prisma.admin.count();
    const appoinmentCount = await prisma.appoinment.count();
    const paymentCount = await prisma.payment.count();

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    });

    const berChartData = await getPieChartData();
    const pieChartData = await getPieChartData();


    return {
        patientCount,
        doctorCount,
        adminCount,
        appoinmentCount,
        paymentCount,
        totalRevenue,
        berChartData,
        pieChartData
    }

}



const getBerChartData = async() => {
    const appoinmentCountPerMonth = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', 'createdAt') AS month,
        CAST(COUNT(*) AS INTEGER) AS count,
        FROM "appoinments",
        GROUP BY month,
        ORDER BY ASC
    `
    return appoinmentCountPerMonth
}


const getPieChartData = async() => {

    const appoinmentStatusDistribution = await prisma.appoinment.groupBy({
        by: ["status"],
        _count: {
            id: true
        }
    })

    const formatedAppoinmentStatusDistribution = appoinmentStatusDistribution.map(({status, _count}) => ({
        status,
        count: Number(_count.id)
    }));

    return formatedAppoinmentStatusDistribution;

} 

export const MetaController = {
fetchDashboardMetaData
}