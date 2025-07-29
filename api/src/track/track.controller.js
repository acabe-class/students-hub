import * as trackService from "./track.service.js";
import { catchAsync, sendResponse } from "../lib/utils.js";
import { UnprocessableEntityError } from "../lib/errors.lib.js";
import { createTrackSchema } from "./track.schema.js";

export const getAllTracks = catchAsync(async (req, res) => {
  const tracks = await trackService.getAllTracks();

  sendResponse(res, 200, "Tracks data fetched successfully", { tracks });
});

export const getTrackById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const track = await trackService.getTrackById(id);

  sendResponse(res, 200, "Track data fetched successfully", { track });
});

export const createTrack = catchAsync(async (req, res) => {
  const results = createTrackSchema.safeParse(req.body);

  if (results.error?.issues)
    throw new UnprocessableEntityError(
      "The request failed with the following errors",
      results.error.issues
    );

  const track = await trackService.createTrack(results.data);

  sendResponse(res, 201, "Track created successfully", { track });
});

export const updateTrack = catchAsync(async (req, res) => {
  const { id } = req.params;
  const results = createTrackSchema.safeParse(req.body);

  if (results.error?.issues)
    throw new UnprocessableEntityError(
      "The request failed with the following errors",
      results.error.issues
    );

  const track = await trackService.updateTrack(id, results.data);

  sendResponse(res, 200, "Track updated successfully", { track });
});

export const deleteTrack = catchAsync(async (req, res) => {
  const { id } = req.params;
  await trackService.deleteTrack(id);

  sendResponse(res, 204, "Track record deleted");
});
