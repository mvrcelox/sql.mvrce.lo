export interface IException {
   name: string;
   message: string;
   action: string;
   status: number;
}

export interface ExceptionOptions {
   action?: string;
   cause?: Error;
   message?: string;
}

export class Exception extends Error implements IException {
   declare public status: number;
   declare public action: string;

   toJSON() {
      return {
         name: this.name,
         message: this.message,
         action: this.action,
         status: this.status,
      };
   }
}

// > 400
export class BadRequestException extends Exception {
   public readonly name = "BadRequest";
   public readonly status = 400;
   public readonly action = "Check the method and try again";

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "Bad request.", options);
   }
}

export class NewBadRequestException extends Exception {
   declare public readonly name = "BadRequest";
   declare public readonly action: string;
   declare public readonly message: string;
   declare public readonly status = 400;

   private constructor(options?: ExceptionOptions) {
      const message = options?.message ?? "Bad request.";
      super(message, { cause: options?.cause });

      this.action = options?.action ?? "Check the method and try again";
   }

   public static create(options?: Partial<ExceptionOptions>): NewBadRequestException {
      return new NewBadRequestException(options);
   }
}

export class UnauthorizedException extends Exception {
   public name = "Unauthorized";
   public status = 401;
   public action = "Login to your account";

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "You aren't logged in.", options);
   }
}

export class NotFoundException extends Exception {
   public name = "NotFound";
   public status = 404;
   public action = "Check if the resource exists and try again";

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "Not found, check if exists.", options);
   }
}

export class NewNotFoundException extends Exception {
   declare public readonly name = "NotFound";
   declare public readonly action: string;
   declare public readonly message: string;
   declare public readonly status = 400;

   private constructor(options?: ExceptionOptions) {
      const message = options?.message ?? "Resource not found.";
      super(message, { cause: options?.cause });

      this.action = options?.action ?? "Check if the resource exists and try again";
   }

   public static create(options?: Partial<ExceptionOptions>): NewNotFoundException {
      return new NewNotFoundException(options);
   }
}

export class MethodNotAllowedException extends Exception {
   public name = "MethodNotAllowed";
   public status = 405;
   public action = "Verify the method and try again";

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "This method is not allowed, try again later.", options);
   }
}

export class RequestTimeoutException extends Exception {
   public name = "RequestTimeout";
   public status = 408;
   public action = "Check your connection and try again";
   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "The request timed out, check your connection and try again.", options);
   }
}

// > 500
export class InternalServerException extends Exception {
   public name = "InternalServerError";
   public status = 500;
   public action = "Enter in contact with the support";

   constructor(options?: ErrorOptions) {
      super("An unexpected internal server error has ocurred.", options);
      if (options?.cause instanceof Exception) {
         this.status = options?.cause?.status;
      }
   }
}
export class NewInternalServerException extends Exception {
   declare public readonly name = "InternalServerException";
   declare public readonly action: string;
   declare public readonly message: string;
   declare public readonly status: number;

   private constructor(options?: ExceptionOptions) {
      const message = options?.message ?? "An unexpected internal server error has occurred.";
      super(message, options);

      this.action = options?.action ?? "Enter in contact with the support";
      this.status = options?.cause instanceof Exception ? options?.cause?.status : 500;
   }

   public static create(options?: ExceptionOptions): NewInternalServerException {
      return new NewInternalServerException(options);
   }
}

export class NotImplementedException extends Exception {
   public name = "NotImplemented";
   public status = 501;
   public action = "This feature is not implemented yet";

   constructor(message?: string, options?: ErrorOptions) {
      super(message ?? "This feature is not implemented yet.", options);
   }
}

export class NewNotImplementedException extends Exception {
   declare public readonly name = "NotImplementedException";
   declare public readonly action: string;
   declare public readonly message: string;
   declare public readonly status: number;

   private constructor(options?: ExceptionOptions) {
      const message = options?.message ?? "This feature is not implemented yet.";
      super(message, options);

      this.action = options?.action ?? "Wait this feature to be implemented or enter in contact with the support";
      this.status = options?.cause instanceof Exception ? options?.cause?.status : 500;
   }

   public static create(options?: ExceptionOptions): NewNotImplementedException {
      return new NewNotImplementedException(options);
   }
}
