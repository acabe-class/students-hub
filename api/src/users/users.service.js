import { db } from '../database/models/index.js';
import { NotFoundError } from '../lib/errors.lib.js';


export const createUser = async (payload) => { };

export const getUserById = async (id) => {
    const user = await db.User.findByPk(id, {
        attributes: { exclude: ['password'] }
    });

    if (!user) throw new NotFoundError('user record does not exist');

    return user;
}

export const getUserByEmail = async (email) => {
    const user = await db.User.findOneBy({ where: {
        email
    }});

    if (!user) throw new NotFoundError('user record does not exist');

    return user;
}