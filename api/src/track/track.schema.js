import { z } from "zod";

export const createTrackSchema = z.object( {
    name: z.string().min( 1, { message: "Name is required" } ),
    description: z.string().min( 1, { message: "Description is required" } ),
} );