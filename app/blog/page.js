import Link from "next/link"

export default function BlogPage() {
  const posts = [
    { slug: "hello-world", title: "Hello World" },
    { slug: "nextjs-guide", title: "Getting Started with Next.js" },
  ]

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
