import { IJWTPayload } from "../../types/common";
import { PaymentStatus, UserRole } from "../../../generated/enums";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";

const fetchDashboardMetaData = async(user: IJWTPayload) => {

    let metaData;
    switch (user.role) {
        case UserRole.PATIENT:
            metaData = await getAdminMetaData();
            break;
        case UserRole.DOCTOR:
             metaData = await getDoctorMetaData(user);
            break;
        case UserRole.ADMIN:
             metaData = "Admin Data";
            break;
        default:
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user role")
    }

    return metaData
}



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

    const berChartData = await getBerChartData();
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



const getDoctorMetaData = async (user: IJWTPayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    const appointmentCount = await prisma.appoinment.count({
        where: {
            doctorId: doctorData.id
        }
    });

    const patientCount = await prisma.appoinment.groupBy({
        by: ['patientId'],
        _count: {
            id: true
        }
    });

    const reviewCount = await prisma.review.count({
        where: {
            doctorId: doctorData.id
        }
    });

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            appoinment: {
                doctorId: doctorData.id
            },
            status: PaymentStatus.PAID
        }
    });

    const appointmentStatusDistribution = await prisma.appoinment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            doctorId: doctorData.id
        }
    });

    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }))

    return {
        appointmentCount,
        reviewCount,
        patientCount: patientCount.length,
        totalRevenue,
        formattedAppointmentStatusDistribution
    }
}

const getPatientMetaData = async (user: IJWTPayload) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    const appointmentCount = await prisma.appoinment.count({
        where: {
            patientId: patientData.id
        }
    });

    const prescriptionCount = await prisma.prescription.count({
        where: {
            patientId: patientData.id
        }
    });

    const reviewCount = await prisma.review.count({
        where: {
            patientId: patientData.id
        }
    });

    const appointmentStatusDistribution = await prisma.appoinment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            patientId: patientData.id
        }
    });

    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }))

    return {
        appointmentCount,
        prescriptionCount,
        reviewCount,
        formattedAppointmentStatusDistribution
    }
}

export const MetaService = {
    fetchDashboardMetaData
}