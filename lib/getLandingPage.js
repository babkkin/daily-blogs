import db from "@/lib/db";

export async function getLandingPage(userId) {
  try {
    const result = await db.query(
      `SELECT 1 FROM user_categories WHERE user_id = $1 LIMIT 1`,
      [userId]
    );
    return result.rows.length === 0 ? "/category" : "/home";
  } catch (err) {
    return "/";
  }
}
