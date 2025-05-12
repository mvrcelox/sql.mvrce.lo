export interface ICustomError {
   statusCode: number;
}

export class BaseCustomError extends Error implements ICustomError {
   declare public statusCode: number;
   declare public action?: string;

   toJSON() {
      return {
         name: this.name,
         message: this.message,
         action: this.action,
         status_code: this.statusCode,
      };
   }
}

// > 400
export class BadRequestError extends BaseCustomError {
   public name = "BadRequest";
   public statusCode = 400;
   public action = "Check the method and try again";

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "Bad request.", options);
   }
}

export class UnauthorizedError extends BaseCustomError {
   public name = "Unauthorized";
   public statusCode = 401;
   public action = "Login to your account";

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "You aren't logged in.", options);
   }
}

export class NotFoundError extends BaseCustomError {
   public name = "NotFound";
   public statusCode = 404;
   public action = "Check if the resource exists and try again";

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "Not found, check if exists and try again.", options);
   }
}

// > 500
export class InternalServerError extends BaseCustomError {
   public name = "InternalServerError";
   public statusCode = 500;
   public action = "Enter in contact with the support";

   constructor(options?: ErrorOptions) {
      super("An unexpected internal server error has ocurred.", options);
      if (options?.cause instanceof BaseCustomError) {
         this.statusCode = options?.cause?.statusCode;
      }
   }
}

export class MethodNotAllowedError extends BaseCustomError {
   public name = "MethodNotAllowed";
   public statusCode = 501;
   public actio = "Verify the method and try again";

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "This method is not allowed, try again later.", options);
   }
}
