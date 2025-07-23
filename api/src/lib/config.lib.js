import dotenv from 'dotenv';
dotenv.config();

export default {
    getOrThrow ( key )
    {
        const value = process.env[ key ];

        if ( !value ) throw new Error( `Missing required environment variable: ${key}` );

        return value;
    },

    getEnvironment ()
    {
        return process.env.NODE_ENV || 'development';
    }
}