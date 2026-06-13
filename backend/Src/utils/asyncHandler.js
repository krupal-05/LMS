const asyncHandler = (responceHandler) => {
  (req, res, next) => {
    Promise.resolve(responceHandler(req, res, next)).catch((err) => {
      next();
    });
  };
};

export { asyncHandler };
