class ApiError extends Error {
  constructor(
    statuscode,
    message = "Someting went wrong ",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statuscode = statuscode;
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = errors;
  }
}
