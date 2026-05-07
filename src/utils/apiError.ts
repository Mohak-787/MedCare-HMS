export class ApiError extends Error {
  statusCode: number;
  error: any[];
  data: any;

  constructor(
    statusCode: number,
    message: string = "something went wrong",
    errors: any[] = [],
    stack?: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.error = errors;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this.constructor);
    }
  }
}
