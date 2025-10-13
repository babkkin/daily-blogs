import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: SECRET });

    // Optional: Add admin check
    // if (!token || token.role !== 'admin') {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    // }

    // Get total posts
    const totalPostsRes = await pool.query(
      "SELECT COUNT(*) FROM blogs WHERE status = 'published'"
    );
    const totalPosts = parseInt(totalPostsRes.rows[0].count);

    // Get active users (users who posted in last 30 days)
    const activeUsersRes = await pool.query(`
      SELECT COUNT(DISTINCT user_id) FROM blogs 
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `);
    const activeUsers = parseInt(activeUsersRes.rows[0].count);

    // Get total comments
    const totalCommentsRes = await pool.query("SELECT COUNT(*) FROM comments");
    const totalComments = parseInt(totalCommentsRes.rows[0].count);

    // Get draft posts count
    const pendingReviewsRes = await pool.query(
      "SELECT COUNT(*) FROM blogs WHERE status = 'draft'"
    );
    const pendingReviews = parseInt(pendingReviewsRes.rows[0].count);

    // Posts per day (last 7 days)
    const postsPerDayRes = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'Dy') as name,
        COUNT(*) as posts
      FROM blogs
      WHERE created_at >= NOW() - INTERVAL '7 days'
        AND status = 'published'
      GROUP BY DATE(created_at), TO_CHAR(created_at, 'Dy')
      ORDER BY DATE(created_at)
    `);

    // Fill in missing days with 0 posts
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (today - i + 7) % 7;
      const dayName = daysOfWeek[dayIndex];
      const found = postsPerDayRes.rows.find(row => row.name === dayName);
      last7Days.push({
        name: dayName,
        posts: found ? parseInt(found.posts) : 0
      });
    }

    // User growth (last 6 months) - based on when they first posted
    const usersGrowthRes = await pool.query(`
      SELECT 
        TO_CHAR(first_post, 'Mon') as month,
        COUNT(*) as users
      FROM (
        SELECT 
          user_id,
          MIN(created_at) as first_post
        FROM blogs
        WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY user_id
      ) subquery
      GROUP BY DATE_TRUNC('month', first_post), TO_CHAR(first_post, 'Mon')
      ORDER BY DATE_TRUNC('month', first_post)
    `);

    // Create month labels for last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      const found = usersGrowthRes.rows.find(row => row.month === monthName);
      last6Months.push({
        month: monthName,
        users: found ? parseInt(found.users) : 0
      });
    }

    // Alternative: Get total users count by month (cumulative)
    const totalUsersRes = await pool.query("SELECT COUNT(*) FROM users_profile");
    const totalUsers = parseInt(totalUsersRes.rows[0].count);

    // If no user growth data, distribute users evenly across months
    const usersGrowth = usersGrowthRes.rows.length > 0 
      ? last6Months
      : last6Months.map((month, index) => ({
          ...month,
          users: Math.floor((totalUsers / 6) * (index + 1))
        }));

    return NextResponse.json({
      success: true,
      stats: {
        totalPosts,
        activeUsers,
        totalComments,
        pendingReviews
      },
      postsPerDay: last7Days,
      usersGrowth
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}