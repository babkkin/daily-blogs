import { NextResponse } from "next/server";
import pool from "@/lib/db.js";
import { getToken } from "next-auth/jwt";

// Simple K-Nearest Neighbors (KNN) Collaborative Filtering
function calculateUserSimilarity(userA, userB) {
  const setA = new Set([
    ...(userA.like || []).map(i => `like_${i.post_id}`),
    ...(userA.comment || []).map(i => `comment_${i.post_id}`)
  ]);
  
  const setB = new Set([
    ...(userB.like || []).map(i => `like_${i.post_id}`),
    ...(userB.comment || []).map(i => `comment_${i.post_id}`)
  ]);
  
  // Jaccard similarity: intersection / union
  const intersection = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  
  return union > 0 ? intersection / union : 0;
}

// TF-IDF style scoring for content-based filtering
function calculateCategoryRelevance(userHistory) {
  const categoryFrequency = {};
  const totalInteractions = (userHistory.like?.length || 0) + (userHistory.comment?.length || 0);
  
  // Count category frequencies with weights
  if (userHistory.like) {
    userHistory.like.forEach(item => {
      categoryFrequency[item.category] = (categoryFrequency[item.category] || 0) + 2;
    });
  }
  
  if (userHistory.comment) {
    userHistory.comment.forEach(item => {
      categoryFrequency[item.category] = (categoryFrequency[item.category] || 0) + 1;
    });
  }
  
  // Calculate TF-IDF style scores (normalized frequency)
  const categoryScores = {};
  for (const [category, freq] of Object.entries(categoryFrequency)) {
    categoryScores[category] = freq / totalInteractions;
  }
  
  return categoryScores;
}

// Generate diverse and meaningful reasons
function generateRecommendationReason(blog, userCategoryScores, similarUsersLikes, scores, userHistorySize, index) {
  const reasons = [];
  const categoryScore = userCategoryScores[blog.category] || 0;
  const collaborativeScore = similarUsersLikes[blog.id] || 0;
  
  // Priority 1: Category-based (if strong match)
  if (categoryScore > 0.4) {
    reasons.push(`You love ${blog.category} content`);
  } else if (categoryScore > 0.25) {
    reasons.push(`You frequently read ${blog.category}`);
  } else if (categoryScore > 0.1) {
    reasons.push(`Based on your interest in ${blog.category}`);
  }
  
  // Priority 2: Collaborative filtering (if strong signal)
  if (collaborativeScore > 0.6) {
    reasons.push("Highly recommended by readers like you");
  } else if (collaborativeScore > 0.4) {
    reasons.push("Readers like you loved this");
  } else if (collaborativeScore > 0.2) {
    reasons.push("Popular with similar readers");
  }
  
  // Priority 3: Popularity signals
  if (blog.claps_count > 100) {
    reasons.push("Trending with exceptional engagement");
  } else if (blog.claps_count > 50) {
    reasons.push("Trending with high engagement");
  } else if (blog.claps_count > 20) {
    reasons.push("Well-received by the community");
  } else if (blog.claps_count > 10) {
    reasons.push("Rising in popularity");
  }
  
  // Priority 4: Content quality indicators
  if (scores.contentScore > 0.3) {
    reasons.push("Matches your reading style");
  }
  
  // Priority 5: Exploration (for variety)
  if (categoryScore === 0 && collaborativeScore > 0.1) {
    reasons.push("Discover something new");
  }
  
  // For small history, provide diverse reasons
  if (userHistorySize <= 3) {
    const diverseReasons = [
      "Trending among new readers",
      "Popular choice to get started",
      "Highly engaging for beginners",
      "Recommended to explore"
    ];
    if (index < diverseReasons.length) {
      reasons.push(diverseReasons[index]);
    }
  }
  
  // Fallback reasons with variety
  const fallbackReasons = [
    "Recommended based on quality",
    "Popular among readers",
    "Featured content",
    "Worth exploring"
  ];
  
  if (reasons.length === 0) {
    return fallbackReasons[index % fallbackReasons.length];
  }
  
  // Return the most relevant reason (prioritized by order)
  return reasons[0];
}

// Machine Learning: Predict score for a blog based on user profile
function predictBlogScore(blog, userCategoryScores, similarUsersLikes) {
  let score = 0;
  const scores = {};
  
  // Content-based score (50% weight)
  const categoryRelevance = userCategoryScores[blog.category] || 0;
  scores.contentScore = categoryRelevance * 0.5;
  score += scores.contentScore;
  
  // Collaborative filtering score (30% weight)
  const collaborativeScore = similarUsersLikes[blog.id] || 0;
  scores.collaborativeScore = collaborativeScore * 0.3;
  score += scores.collaborativeScore;
  
  // Popularity signal (20% weight) - normalized
  const popularityScore = Math.min(blog.claps_count / 100, 1); // cap at 100 claps
  scores.popularityScore = popularityScore * 0.2;
  score += scores.popularityScore;
  
  return { score, scores };
}

export async function GET(request) {
  try {
    // Get user_id from NextAuth token
    const token = await getToken({ req: request });
    const userId = token?.sub;

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized" 
      }, { status: 401 });
    }

    // Get current user's history
    const historyResult = await pool.query(
      `SELECT history FROM users_history WHERE user_id = $1`,
      [userId]
    );

    const userHistory = historyResult.rows[0]?.history;
    const userHistorySize = (userHistory?.like?.length || 0) + (userHistory?.comment?.length || 0);
    
    // Check if user has no history or empty history
    const hasNoHistory = !userHistory || 
                        !historyResult.rows[0] ||
                        userHistorySize === 0;
    
    if (hasNoHistory) {
      // No history - return popular blogs with diverse reasons
      const { rows } = await pool.query(`
        SELECT 
          b.blog_id AS id,
          b.title,
          b.content,
          b.category,
          b.created_at,
          u.user_name,
          (SELECT COUNT(*) FROM claps WHERE blog_id::text = b.blog_id::text) as claps_count
        FROM blogs b
        LEFT JOIN users_profile u ON b.user_id = u.user_id
        WHERE b.status = 'published'
        ORDER BY claps_count DESC, b.created_at DESC
        LIMIT 4
      `);

      // Add diverse reasons for cold start
      const coldStartReasons = [
        "Most popular this week",
        "Trending with high engagement",
        "Editor's pick",
        "Highly recommended to start"
      ];

      const blogsWithReasons = rows.map((blog, index) => ({
        ...blog,
        reason: blog.claps_count > 50 
          ? coldStartReasons[index % coldStartReasons.length]
          : "Popular among readers"
      }));

      return NextResponse.json({ 
        success: true, 
        blogs: blogsWithReasons,
        method: 'cold_start',
        personalized: false
      });
    }

    // Get all other users' histories for collaborative filtering
    const allUsersResult = await pool.query(
      `SELECT user_id, history FROM users_history WHERE user_id != $1`,
      [userId]
    );

    // STEP 1: Collaborative Filtering - Find similar users (KNN)
    const userSimilarities = allUsersResult.rows
      .map(row => ({
        user_id: row.user_id,
        similarity: calculateUserSimilarity(userHistory, row.history)
      }))
      .filter(u => u.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5); // K=5 nearest neighbors

    // Aggregate what similar users liked
    const similarUsersLikes = {};
    for (const { user_id, similarity } of userSimilarities) {
      const similarUser = allUsersResult.rows.find(r => r.user_id === user_id);
      if (similarUser?.history?.like) {
        similarUser.history.like.forEach(item => {
          similarUsersLikes[item.post_id] = (similarUsersLikes[item.post_id] || 0) + similarity;
        });
      }
    }

    // STEP 2: Content-based Filtering - Calculate user's category preferences
    const userCategoryScores = calculateCategoryRelevance(userHistory);

    // Get posts user has already interacted with
    const interactedPostIds = [
      ...(userHistory.like || []).map(i => i.post_id),
      ...(userHistory.comment || []).map(i => i.post_id)
    ];

    // Get candidate blogs (exclude user's own blogs and interacted posts)
    const { rows: candidateBlogs } = await pool.query(`
      SELECT 
        b.blog_id AS id,
        b.title,
        b.content,
        b.category,
        b.created_at,
        b.user_id as blog_user_id,
        u.user_name,
        (SELECT COUNT(*) FROM claps WHERE blog_id::text = b.blog_id::text) as claps_count
      FROM blogs b
      LEFT JOIN users_profile u ON b.user_id = u.user_id
      WHERE b.status = 'published'
        AND b.user_id != $1
        AND NOT (b.blog_id = ANY($2))
      ORDER BY b.created_at DESC
      LIMIT 100
    `, [userId, interactedPostIds.length > 0 ? interactedPostIds : [null]]);

    // STEP 3: ML Prediction - Score each blog using hybrid model
    const scoredBlogs = candidateBlogs.map(blog => {
      const { score, scores } = predictBlogScore(blog, userCategoryScores, similarUsersLikes);
      
      // Add recency boost (newer content gets slight boost)
      const daysSinceCreated = (Date.now() - new Date(blog.created_at).getTime()) / (1000 * 60 * 60 * 24);
      const recencyBoost = Math.max(0, (30 - daysSinceCreated) / 300); // Boost for posts < 30 days old
      
      return {
        ...blog,
        ml_score: score + recencyBoost,
        scores: { ...scores, recencyBoost }
      };
    });

    // Add diversity: ensure different categories in top results
    const diverseRecommendations = [];
    const usedCategories = new Set();
    const sortedBlogs = scoredBlogs.sort((a, b) => b.ml_score - a.ml_score);

    // First pass: pick top from each category
    for (const blog of sortedBlogs) {
      if (!usedCategories.has(blog.category) && diverseRecommendations.length < 4) {
        diverseRecommendations.push(blog);
        usedCategories.add(blog.category);
      }
    }

    // Second pass: fill remaining slots with highest scored
    for (const blog of sortedBlogs) {
      if (diverseRecommendations.length >= 4) break;
      if (!diverseRecommendations.find(b => b.id === blog.id)) {
        diverseRecommendations.push(blog);
      }
    }

    const recommendedBlogs = diverseRecommendations
      .slice(0, 4)
      .map((blog, index) => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        category: blog.category,
        user_name: blog.user_name,
        claps_count: blog.claps_count,
        confidence: Math.round(blog.ml_score * 100),
        reason: generateRecommendationReason(
          blog, 
          userCategoryScores, 
          similarUsersLikes, 
          blog.scores,
          userHistorySize,
          index
        )
      }));

    // If still no blogs, fallback to popular
    if (recommendedBlogs.length === 0) {
      const { rows } = await pool.query(`
        SELECT 
          b.blog_id AS id,
          b.title,
          b.content,
          b.category,
          u.user_name,
          (SELECT COUNT(*) FROM claps WHERE blog_id::text = b.blog_id::text) as claps_count
        FROM blogs b
        LEFT JOIN users_profile u ON b.user_id = u.user_id
        WHERE b.status = 'published'
          AND b.user_id != $1
        ORDER BY claps_count DESC, RANDOM()
        LIMIT 4
      `, [userId]);

      const fallbackReasons = [
        "Popular among readers",
        "Trending content",
        "Community favorite",
        "Worth exploring"
      ];

      const blogsWithReasons = rows.map((blog, index) => ({
        ...blog,
        reason: fallbackReasons[index % fallbackReasons.length]
      }));

      return NextResponse.json({ 
        success: true, 
        blogs: blogsWithReasons,
        method: 'fallback_popular',
        personalized: false
      });
    }

    return NextResponse.json({ 
      success: true, 
      blogs: recommendedBlogs,
      method: 'ml_hybrid',
      personalized: true,
      similar_users_found: userSimilarities.length,
      user_history_size: userHistorySize,
      categories_interested: Object.keys(userCategoryScores)
    });
  } catch (err) {
    console.error("Error fetching recommended blogs:", err);
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
}