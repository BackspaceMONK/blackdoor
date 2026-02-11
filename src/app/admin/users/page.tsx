'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import GlassCard from '@/components/GlassCard';
import { useAdminStore } from '@/store/useAdminStore';
import { getUsers, User, updateUserPassword, deleteUser } from '@/lib/auth-db';
import { Trash2, Edit, Key, User as UserIcon } from 'lucide-react';

export default function AdminUsersPage() {
  const { isAdminLoggedIn } = useAdminStore();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAdminLoggedIn) {
      router.push('/admin/login');
    } else if (mounted && isAdminLoggedIn) {
      loadUsers();
    }
  }, [mounted, isAdminLoggedIn, router]);

  const loadUsers = async () => {
    const usersData = await getUsers();
    setUsers(usersData);
  };

  const handleDeleteUser = async (username: string) => {
    if (confirm(`Delete user "${username}"?`)) {
      const success = await deleteUser(username);
      if (success) {
        await loadUsers();
      } else {
        alert('Failed to delete user');
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (!editingUser || !newPassword) return;
    
    const success = await updateUserPassword(editingUser.username, newPassword);
    if (success) {
      setEditingUser(null);
      setNewPassword('');
      await loadUsers();
    } else {
      alert('Failed to update password');
    }
  };

  if (!mounted || !isAdminLoggedIn) return null;

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-red-400">
            Users Management
          </h1>
          <p className="text-gray-400">View and manage user accounts</p>
        </div>

        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Users ({users.length})</h2>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No users registered yet
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.username} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <UserIcon className="text-purple-400" size={24} />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{user.username}</div>
                        <div className="text-sm text-gray-400 flex items-center space-x-2">
                          <Key size={14} />
                          <span className="font-mono">{user.recovery_code}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition"
                      >
                        <Edit size={16} className="inline mr-1" />
                        Edit Password
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition"
                      >
                        <Trash2 size={16} className="inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <GlassCard className="w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Edit Password for {editingUser.username}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-red-500 transition"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdatePassword}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setNewPassword('');
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
