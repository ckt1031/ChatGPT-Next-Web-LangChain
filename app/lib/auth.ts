import NextAuth from "next-auth";
import ZITADEL from "next-auth/providers/zitadel";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: !!process.env.AUTH_ZITADEL_ID
    ? [
        ZITADEL({
          issuer: process.env.AUTH_ZITADEL_ISSUER,
          clientId: process.env.AUTH_ZITADEL_ID,
          clientSecret: process.env.AUTH_ZITADEL_SECRET,
        }),
      ]
    : [],
});
