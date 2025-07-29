export const catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export const sendResponse = ( res, statusCode, message, data = null ) =>
{
  return res.status( statusCode ).json( {
    success: true,
    message,
    data,
  })
}