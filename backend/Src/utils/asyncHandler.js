const asyncHandler = (responceHandler) => {
  return (req, res, next) => {
    Promise.resolve(responceHandler(req, res, next)).catch((err) => {
      next();
    });
  };
};

export default asyncHandler ;
