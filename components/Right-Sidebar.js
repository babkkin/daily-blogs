import React, { useState } from 'react';
import { Users, BookmarkPlus } from 'lucide-react';

export default function MediumSidebar() {
  const [followedUsers, setFollowedUsers] = useState(new Set());

  const topics = ['Technology', 'Design', 'Programming', 'AI', 'Productivity', 'Writing'];
  
  const users = [
    { id: 1, name: 'Sarah Chen', tagline: 'Design lead at tech startup', avatar: 'SC' },
    { id: 2, name: 'Alex Rivera', tagline: 'Full-stack developer & writer', avatar: 'AR' },
    { id: 3, name: 'Maya Patel', tagline: 'Product manager, tech enthusiast', avatar: 'MP' }
  ];

  const articles = [
    { id: 1, title: 'The Future of Web Development in 2025', author: 'John Doe', reads: '5 min read' },
    { id: 2, title: 'How AI is Reshaping Creative Industries', author: 'Jane Smith', reads: '8 min read' },
    { id: 3, title: 'Building Better User Experiences', author: 'Mike Johnson', reads: '6 min read' },
    { id: 4, title: 'The Art of Clean Code', author: 'Emily Davis', reads: '7 min read' }
  ];

  const toggleFollow = (userId) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Recommended Topics */}
      <div className="mt-[5vh]">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Discover more of what matters to you
        </h3>
        <div className="flex flex-wrap gap-2">
          {topics.map(topic => (
            <button
              key={topic}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Who to Follow */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={18} />
          Who to follow
        </h3>
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">{user.name}</h4>
                <p className="text-xs text-gray-500 truncate">{user.tagline}</p>
              </div>
              <button
                onClick={() => toggleFollow(user.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition flex-shrink-0 ${
                  followedUsers.has(user.id)
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {followedUsers.has(user.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Reading */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookmarkPlus size={18} />
          Recommended reading
        </h3>
        <div className="space-y-5">
          {articles.map(article => (
            <div key={article.id} className="group cursor-pointer">
              <h4 className="font-medium text-gray-900 text-sm leading-snug mb-1 group-hover:text-black line-clamp-2">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{article.author}</span>
                <span>·</span>
                <span>{article.reads}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-900">Help</a>
          <a href="#" className="hover:text-gray-900">Status</a>
          <a href="#" className="hover:text-gray-900">About</a>
          <a href="#" className="hover:text-gray-900">Careers</a>
          <a href="#" className="hover:text-gray-900">Blog</a>
          <a href="#" className="hover:text-gray-900">Privacy</a>
          <a href="#" className="hover:text-gray-900">Terms</a>
          <a href="#" className="hover:text-gray-900">Text to speech</a>
          <a href="#" className="hover:text-gray-900">Teams</a>
        </div>
      </div>

    </div>
  );
}