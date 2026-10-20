function errorHandler(err, req, res, next) {
  // Log the error using Pino HTTP
  console.log(req.log);
  req.log.error({ err }, 'Request failed');

  // Save the error to the database


  // Send a generic error response
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).json({
    error: 'Internal Server Error',
    requestId: req.id
  });
}

module.exports = errorHandler;
