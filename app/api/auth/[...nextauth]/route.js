import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        await db.query(
          `INSERT INTO users (user_email, verified)
           VALUES ($1, true)
           ON CONFLICT (user_email) DO NOTHING`,
          [user.email]
        );
        return true;
      } catch (err) {
        console.error("Error inserting Google user:", err);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
