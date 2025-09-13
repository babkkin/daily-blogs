export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Daily Experiences and Wisdom
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          A safe space to read, write, and expand your knowledge
        </p>
        <button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200 text-lg font-medium">
          Join us
        </button>
      </div>
    </div>
  );
}
