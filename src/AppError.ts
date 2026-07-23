export class AppError extends Error {
  constructor(public statusCode: number, message: string, public errorDetails: any = null) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}