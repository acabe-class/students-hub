import { catchAsync, sendResponse } from "../lib/utils.js";
import { UnprocessableEntityError } from "../lib/errors.lib.js";
import * as cohortService from './cohort.service.js';
import { createCohortSchema } from "./cohort.schema.js";


export const getAllCohorts = catchAsync( async ( req, res ) =>
{
    const cohorts = await cohortService.getAllCohorts();

    sendResponse( res, 200, "Cohorts data fetched successfully", { cohorts } );
} )

export const getCohortById = catchAsync( async ( req, res ) =>
{
    const { id } = req.params;
    const cohort = await cohortService.getCohortById( id );

    sendResponse( res, 200, "Cohort data fetched successfully", { cohort } );
} )

export const createCohort = catchAsync( async ( req, res ) =>
{
    const results = createCohortSchema.safeParse( req.body );
    
    if ( results.error?.issues ) throw new UnprocessableEntityError( "The request failed with the following errors", results.error.issues );

    const cohort = await cohortService.createCohort( results.data );

    sendResponse( res, 201, "Cohort created successfully", { cohort } );
} );
 
export const updateCohort = catchAsync( async ( req, res ) =>
{
    const { id } = req.params;
     const results = createCohortSchema.safeParse(req.body);
    if (results.error?.issues)
      throw new UnprocessableEntityError(
        "The request failed with the following errors",
        results.error.issues
      );

    const cohort = await cohortService.updateCohort(id,results.data);

    sendResponse(res, 200, "Cohort updated successfully", { cohort });
} )

export const deleteCohort = catchAsync( async ( req, res ) =>
{
    const { id } = req.params;
    await cohortService.deleteCohort( id );

    sendResponse( res, 204, "Cohort record deleted" );
})