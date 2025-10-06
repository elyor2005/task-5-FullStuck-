"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Lock, Unlock, Trash2 } from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
  status: "active" | "blocked" | "unverified";
  createdAt: string;
  lastLogin: string | null;
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      const data = await res.json();
      const sortedUsers = data.users.sort((a: User, b: User) => {
        const aTime = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        const bTime = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
        return bTime - aTime;
      });
      setUsers(sortedUsers);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle checkbox selection
  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  // Select all users
  const selectAll = () => {
    if (selectedIds.size === users.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(users.map((u) => u._id)));
  };

  // Toolbar actions
  const handleAction = async (action: "block" | "unblock" | "delete" | "deleteUnverified") => {
    if (selectedIds.size === 0 && action !== "deleteUnverified") return;

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      const data = await res.json();
      toast.success(data.message || "Action completed");
      await fetchUsers(); // refresh table
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  // Check selected users' status for toggle button
  const selectedUsers = users.filter((u) => selectedIds.has(u._id));
  const allActive = selectedUsers.every((u) => u.status === "active");
  const allBlocked = selectedUsers.every((u) => u.status === "blocked");

  // Filtered users list
  const filteredUsers = users.filter((user) => {
    const q = filter.toLowerCase();
    return user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.status.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8 w-full ">
      <Toaster position="top-right" />

      <div className="mx-auto">
        {/* Card wrapper */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Toolbar */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
            <div className="flex gap-2">
              {/* Always show both buttons side by side */}
              <button
                onClick={() => handleAction("block")}
                disabled={selectedIds.size === 0}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition
      ${selectedIds.size === 0 ? "text-gray-400 border-gray-300 cursor-not-allowed" : "text-blue-600 border-blue-300 hover:bg-blue-50"}`}
              >
                <Lock size={16} /> Block
              </button>

              <button
                onClick={() => handleAction("unblock")}
                disabled={selectedIds.size === 0}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition
      ${selectedIds.size === 0 ? "text-gray-400 border-gray-300 cursor-not-allowed" : "text-green-600 border-green-300 hover:bg-green-50"}`}
              >
                <Unlock size={16} /> Unblock
              </button>

              <button
                onClick={() => handleAction("delete")}
                disabled={selectedIds.size === 0}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition
      ${selectedIds.size === 0 ? "text-gray-400 border-gray-300 cursor-not-allowed" : "text-red-600 border-red-300 hover:bg-red-50"}`}
              >
                <Trash2 size={16} /> Delete
              </button>

              <button
                onClick={() => handleAction("deleteUnverified")}
                disabled={!users.some((u) => u.status === "unverified")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition
      ${!users.some((u) => u.status === "unverified") ? "text-gray-400 border-gray-300 cursor-not-allowed" : "text-orange-600 border-orange-300 hover:bg-orange-50"}`}
              >
                <Trash2 size={16} /> Delete Unverified
              </button>
            </div>

            {/* Filter input */}
            <div>
              <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by name, email, status..." className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="px-4 py-2">
                    <input type="checkbox" checked={selectedIds.size === users.length && users.length > 0} onChange={selectAll} className="accent-blue-500" />
                  </th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Login</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3 ">
                      <input type="checkbox" checked={selectedIds.has(user._id)} onChange={() => toggleSelect(user._id)} className="accent-blue-500" />
                    </td>
                    <td className="px-4 py-2 font-medium">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === "active" ? "bg-green-100 text-green-700" : user.status === "blocked" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-2">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && <div className="mt-4 text-center text-gray-500 text-sm">Loading...</div>}
        </div>
      </div>
    </div>
  );
}
