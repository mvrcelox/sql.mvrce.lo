import { Exception, IException } from "@/infra/errors";

type SharedResponse = {
   status: number;
};

export interface Failure extends SharedResponse {
   success: false;
   data?: never;
   error: IException;
}

export interface Success<T> extends SharedResponse {
   success: true;
   data: T;
   error?: never;
}

export type Response<T> = Success<T> | Failure;

export function failure(error: Exception): Failure {
   return {
      success: false,
      status: error.status,
      error: error.toJSON(),
   };
}

export function success<T>(data: T, status: number = 200): Success<T> {
   return {
      success: true,
      status,
      data,
   };
}
