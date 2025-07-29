import { z } from "zod";

export const createCohortSchema = z.object( {
    name: z.string().min( 1, { message: "Name is required" } ),
    start_date: z.date().min( new Date(), { message: "Start date must be in the future" } ),
    end_date: z.date().min( new Date(), { message: "End date must be in the future" } ),
} );