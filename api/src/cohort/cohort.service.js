import { Cohort } from "../database/models/cohort.model.js";
import { ConflictError, NotFoundError } from "../lib/errors.lib.js";

export const getAllCohorts = async () => {
  return await Cohort.findAll();
};

export const getCohortById = async (id) => {
    const cohort = await Cohort.findByPk( id );
    
    if ( !cohort ) throw new NotFoundError( "Cohort not found" );

    return cohort;
};

export const createCohort = async (payload) => {
  const existingCohort = await Cohort.findOne({
    where: { name: payload.name },
  });

  if (existingCohort) throw new ConflictError("Cohort already exists");

  return await Cohort.create(payload);
};

export const updateCohort = async (id, payload) => {
  return await Cohort.updateOne({ where: { id } }, payload);
};

export const deleteCohort = async (id) => {
  return await Cohort.dstroy({ where: { id } });
};
