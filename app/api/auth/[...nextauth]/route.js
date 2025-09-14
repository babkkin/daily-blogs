// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;
        const conn = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
        });

        // find matching otp that hasn't expired
        const [rows] = await conn.execute(
          "SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW()",
          [credentials.email, credentials.otp]
        );

        if (!rows || rows.length === 0) {
          await conn.end();
          return null;
        }

        // OTP valid — ensure user exists (create if missing)
        const [users] = await conn.execute("SELECT * FROM users WHERE email = ?", [credentials.email]);
        if (!users || users.length === 0) {
          // create user
          await conn.execute("INSERT INTO users (email) VALUES (?)", [credentials.email]);
        }

        // delete the OTP record (so it can't be reused)
        await conn.execute("DELETE FROM otps WHERE email = ?", [credentials.email]);

        await conn.end();

        // Return a user object. NextAuth will include this in the session.
        return { id: credentials.email, email: credentials.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };



/*const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// ⚠️ For production with MySQL
// Example using mysql2 package
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,   // e.g. "localhost"
  user: process.env.DB_USER,   // e.g. "root"
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Save OTP
await connection.execute(
  "INSERT INTO otps (email, code, expiresAt) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE code=?, expiresAt=?",
  [identifier, otp, new Date(Date.now() + 10 * 60 * 1000), otp, new Date(Date.now() + 10 * 60 * 1000)]
);

// Verify OTP
const [rows] = await connection.execute(
  "SELECT * FROM otps WHERE email=? AND code=? AND expiresAt > NOW()",
  [email, enteredOtp]
);

if (rows.length > 0) {
  // ✅ OTP is valid
} else {
  // ❌ invalid or expired
}
  

Keep this commented in your file 
  plug MySQL in later.


CREATE TABLE otps (
  email VARCHAR(255) PRIMARY KEY,
  code VARCHAR(6),
  expiresAt DATETIME
);




*/