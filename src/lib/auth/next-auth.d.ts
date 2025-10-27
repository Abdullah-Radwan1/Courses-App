import "next-auth";

declare module "next-auth" {
  interface User {
    id: string | unknown;
    name?: string | null;
    email?: string | null;
  }

  export interface Session {
    user: {
      id: string | unknown;
      name?: string | null;
      email?: string | null;
    };
  }
}
