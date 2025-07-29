export class BaseError extends Error
{
    constructor( message )
    {
        super( message );
        this.name = this.constructor.name;
    }

    formatZodErrors ( errors )
    {
        return errors.map( ( error ) =>
        {
            return {
                path: error.path,
                message: error.message
            }
        } );
    }
}

export class ConflictError extends BaseError
{
    constructor( message )
    {
        super( message );
        this.statusCode = 409;
    }
}

export class NotFoundError extends BaseError
{
    constructor( message )
    {
        super( message );
        this.statusCode = 404;
    }
}

export class BadRequestError extends BaseError
{
    constructor( message )
    {
        super( message );
        this.statusCode = 400;
    }
}

export class UnprocessableEntityError extends BaseError
{
    constructor( message, errors )
    {
        super( message );
        this.statusCode = 422;
        this.errors = this.formatZodErrors( errors );
    }
}

export class UnauthorizedError extends BaseError
{
    constructor( message )
    {
        super(message);
        this.statusCode = 403;
    }
}

export class UnauthenticatedError extends BaseError
{
    constructor( message )
    {
        super( message );
        this.statusCode = 401;
    }
}