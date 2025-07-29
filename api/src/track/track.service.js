import { Track } from "../database/models/track.model.js";
import { ConflictError, NotFoundError } from "../lib/errors.lib.js";

export const getAllTracks = async () => {
    return await Track.findAll();
}

export const getTrackById = async (id) => {
    const track = await Track.findByPk(id);

    if (!track) throw new NotFoundError( "Track not found" );

    return track;
}

export const createTrack = async ( payload ) =>
{
    const existingTrack = await Track.findOne( { where: { name: payload.name } } );

    if ( existingTrack ) throw new ConflictError( "Track already exists" );

    return await Track.create(payload);
}

export const updateTrack = async (id, payload) => {
    const track = await Track.findByPk(id);

    if (!track) throw new NotFoundError( "Track not found" );

    return await Track.update(payload, { where: { id } });
}

export const deleteTrack = async (id) => {
    return await Track.destroy({ where: { id } });
}