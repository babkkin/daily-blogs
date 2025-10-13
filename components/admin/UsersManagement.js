"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserX, UserCheck } from "lucide-react";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBanUser = async (userId, currentlyBanned) => {
    const action = currentlyBanned ? "unban" : "ban";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banned: !currentlyBanned }),
      });

      const data = await res.json();
      if (data.success) {
        setUsers(prev =>
          prev.map(u => (u.user_id === userId ? { ...u, is_banned: !currentlyBanned } : u))
        );
        alert(`User ${action}ned successfully`);
      } else {
        alert(data.error || `Failed to ${action} user`);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} user`);
    }
  };

  const filteredUsers = users.filter(user =>
    user.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10">Loading users...</div>;
  }

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">User Management</h3>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg w-64"
        />
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Total Users: {users.length} • Banned: {users.filter(u => u.is_banned).length}
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No users found</p>
      ) : (
        <div className="grid gap-4">
                  <p className="text-gray-700">Add, remove, or manage user roles.</p>
          {filteredUsers.map((user) => (
            <div
              key={user.user_id}
              className="border rounded-lg p-4 hover:shadow-md transition flex items-center gap-4"
            >
              <Link href={`/profile/${user.user_id}`}>
                {user.profile_url ? (
                  <Image
                    src={user.profile_url}
                    alt={user.user_name}
                    width={60}
                    height={60}
                    className="w-16 h-16 rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    {user.user_name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </Link>

              <div className="flex-1">
                <Link href={`/profile/${user.user_id}`}>
                  <h4 className="font-semibold text-lg hover:underline">
                    {user.user_name || "Unknown User"}
                  </h4>
                </Link>
                <p className="text-sm text-gray-500 line-clamp-1">{user.bio || "No bio"}</p>
                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                  <span>{user.post_count || 0} posts</span>
                  <span>{user.followers_count || 0} followers</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {user.is_banned && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    Banned
                  </span>
                )}
                <button
                  onClick={() => handleBanUser(user.user_id, user.is_banned)}
                  className={`p-2 rounded transition ${
                    user.is_banned
                      ? "hover:bg-green-100 text-green-600"
                      : "hover:bg-red-100 text-red-600"
                  }`}
                  title={user.is_banned ? "Unban user" : "Ban user"}
                >
                  {user.is_banned ? <UserCheck size={20} /> : <UserX size={20} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}