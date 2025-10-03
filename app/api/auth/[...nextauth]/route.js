import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import db from "@/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const result = await db.query(
          `SELECT user_id, user_password, provider, verified
           FROM users WHERE user_email = $1`,
          [credentials.email]
        );

        if (result.rows.length === 0) {
          throw new Error("User not found");
        }

        const user = result.rows[0];

        if (user.provider === "google") {
          throw new Error("This account uses Google login. Please sign in with Google.");
        }

        if (!user.verified) {
          throw new Error("Please verify your email before logging in.");
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.user_password
        );
        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return { id: user.user_id, email: credentials.email };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const result = await db.query(
          `SELECT user_id FROM users WHERE user_email = $1`,
          [user.email]
        );

        let dbUserId;

        if (result.rows.length === 0) {
          const insertResult = await db.query(
            `INSERT INTO users (user_email, provider, verified)
             VALUES ($1, $2, true)
             RETURNING user_id`,
            [user.email, "google"]
          );
          dbUserId = insertResult.rows[0].user_id;
        } else {
          dbUserId = result.rows[0].user_id;
        }

        // ✅ Replace Google’s numeric ID with your DB UUID
        user.id = dbUserId;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id; // always UUID now
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.userId) {
        session.user.id = token.userId; // always UUID
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
