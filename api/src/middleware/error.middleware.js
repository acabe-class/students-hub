import { 
  UnprocessableEntityError, 
  UnauthenticatedError, 
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  BadRequestError 
} from "../lib/errors.lib.js";

export const errorMiddleware = ( err, req, res, next ) =>
{
    //console.error('Error:', err);

    // Handle specific error types
    if ( err instanceof UnprocessableEntityError )
    {
        return res.status( err.statusCode ).json( {
            success: false,
            message: err.message,
            errors: err.errors,
        })
    }

    if ( err instanceof UnauthenticatedError || 
         err instanceof UnauthorizedError ||
         err instanceof NotFoundError ||
         err instanceof ConflictError ||
         err instanceof BadRequestError )
    {
        return res.status( err.statusCode ).json( {
            success: false,
            message: err.message,
        } )
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }

    // Handle Sequelize errors
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(error => ({
            path: error.path,
            message: error.message
        }));
        
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            success: false,
            message: 'Resource already exists'
        });
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid reference'
        });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    return res.status( statusCode ).json( {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    } )
}