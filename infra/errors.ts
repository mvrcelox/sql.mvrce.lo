export interface ICustomError {
   statusCode: number;
}

export class BaseCustomError extends Error implements ICustomError {
   declare public statusCode: number;

   toJSON() {
      return {
         name: this.name,
         message: this.message,
         status_code: this.statusCode,
      };
   }
}

// > 400
export class BadRequestError extends BaseCustomError {
   public name = "BadRequest";
   public statusCode = 400;

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "Bad request.", options);
   }
}
export class UnauthorizedError extends BaseCustomError {
   public name = "Unauthorized";
   public statusCode = 401;

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "You aren't logged in.", options);
   }
}

export class NotFoundError extends BaseCustomError {
   public name = "NotFound";
   public statusCode = 404;

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "Not found, check if exists and try again.", options);
   }
}

// > 500
export class InternalServerError extends BaseCustomError {
   public name = "InternalServerError";
   public statusCode = 500;

   constructor(options?: ErrorOptions) {
      super("An unexpected internal server error has ocurred.", options);
   }
}

export class MethodNotAllowedError extends BaseCustomError {
   public name = "MethodNotAllowed";
   public statusCode = 501;

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "This method is not allowed, try again later.", options);
   }
}
