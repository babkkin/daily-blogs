export default function BlogPost({ params }) {
  return (
    <div>
      <h1>Post: {params.slug}</h1>
      <p>This is where the blog content would go.</p>
    </div>
  )
}
