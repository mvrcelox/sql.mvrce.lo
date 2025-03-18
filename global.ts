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
