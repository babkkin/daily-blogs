import db from "@/lib/db";

export async function getLandingPage(userId) {
  try {
    const result = await db.query(
      `SELECT 1 FROM user_categories WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    console.log("Landing check → userId:", userId);
    console.log("Query result:", result.rows);

    return result.rows.length === 0 ? "/category" : "/home";
  } catch (err) {
    console.error("Error checking categories:", err);
    return "/";
  }
}
