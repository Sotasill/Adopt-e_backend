const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Внутренняя ошибка сервера",
      status: err.status || 500,
    },
  });
};

module.exports = errorHandler;