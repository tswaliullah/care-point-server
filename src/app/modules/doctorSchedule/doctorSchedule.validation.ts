import z from "zod";


const createDoctorSchemaValidationSchema = z.object({
    body: z.object({
        scheduleIds: z.array(z.string())
    })
});

export const DoctorScheduleValidation = {
    createDoctorSchemaValidationSchema
}