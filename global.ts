export interface User {
   id: number;
   name: string;
   email: string;
   image?: string | null;
}

export interface Session {
   user?: User;
}
export interface JWT {
   sub: number;
}

declare global {
   export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
   export type ControllerResponse<T> =
      | { success: true; data: T; error?: never }
      | { success: false; data?: never; error: Record<string, unknown> };
}
