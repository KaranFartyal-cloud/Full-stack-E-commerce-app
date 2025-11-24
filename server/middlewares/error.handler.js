export const errorHandler = (error, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";
  const status = error.status || 500;

  return res.status(status).json({
    success: false,
    message: isProd ? "Something went wrong" : error.message,
    stack: isProd ? null : error.stack,
  });
};
