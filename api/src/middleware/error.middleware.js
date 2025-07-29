export const errorMiddleware = ( err, req, res, next ) =>
{
    if ( err instanceof UnprocessableEntityError )
    {
        return res.status( err.statusCode ).json( {
            success: false,
            message: err.message,
            errors: err.errors,
        })
    }

    return res.status( err.statusCode ).json( {
        success: false,
        message: err.message,
    } )
}