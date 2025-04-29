import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Remove the optional marker
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}