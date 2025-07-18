// Types for the result object with discriminated union
type Success<T> = {
   success: true;
   data: T;
   error?: never;
};

type Failure<E> = {
   success: false;
   data?: never;
   error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export default async function to<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
   try {
      const data = await promise;
      return { success: true, data };
   } catch (error) {
      return { success: false, error: error as E };
   }
}
