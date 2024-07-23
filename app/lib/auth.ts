import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: !!process.env.AUTH_AUTH0_ID
    ? [
      Auth0({
          issuer: process.env.AUTH_AUTH0_ISSUER,
          clientId: process.env.AUTH_AUTH0_ID,
          clientSecret: process.env.AUTH_AUTH0_SECRET,
        }),
      ]
    : [],
});
