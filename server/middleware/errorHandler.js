const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Handle MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    return res.status(409).json({
      message: 'This time slot is already booked. Please choose another one.',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
