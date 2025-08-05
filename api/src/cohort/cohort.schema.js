import { z } from "zod";

export const createCohortSchema = z.object( {
    name: z.string().min( 1, { message: "Name is required" } ),
    start_date: z.string().datetime().transform((val) => new Date(val)),
    end_date: z.string().datetime().transform((val) => new Date(val)),
} ).refine((data) => data.end_date > data.start_date, {
    message: "End date must be after start date",
    path: ["end_date"]
});