import { Gender } from "../../../generated/enums";


export type IDoctorUpdateInput = {
    email: string;
    contactNumber: string | null;
    gender: Gender;
    qualification: string;
    designation: string;
    name: string;
    address: string | null;
    registrationNumber: string;
    experience: number;
    appointmentFee: number;
    currentWorkingPlace: string;
    isDeleted: boolean;
    specialties: {
        specialtyId: string;
          isDeleted?: boolean;
    }[]
}