import Blogdisplay from '@/components/Blogdisplay';

export default function HomePage() {
  return (
    <div>
      <h1>🎉 Welcome to the Homepage!</h1>
      <Blogdisplay /> {/* Nested component with API fetching */}
    </div>
  );
}
