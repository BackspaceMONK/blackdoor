'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import GlassCard from '@/components/GlassCard';
import { useAdminStore } from '@/store/useAdminStore';
import { getOrders, updateOrderStatus, deleteOrder, Order } from '@/lib/admin-db';
import { getUsers } from '@/lib/auth-db';
import { ShoppingCart, Users, DollarSign, TrendingUp, Trash2, Check, X, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const { isAdminLoggedIn } = useAdminStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'cancelled'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAdminLoggedIn) {
      router.push('/admin/login');
    } else if (mounted && isAdminLoggedIn) {
      loadData();
    }
  }, [mounted, isAdminLoggedIn, router]);

  const loadData = async () => {
    const ordersData = await getOrders();
    const usersData = await getUsers();
    setOrders(ordersData);
    setUsers(usersData);
  };

  const handleStatusChange = async (orderId: string | undefined, status: Order['status']) => {
    if (!orderId) return;
    await updateOrderStatus(orderId, status);
    await loadData();
  };

  const handleDeleteOrder = async (orderId: string | undefined) => {
    if (!orderId) return;
    if (confirm('Are you sure you want to delete this order?')) {
      await deleteOrder(orderId);
      await loadData();
    }
  };

  if (!mounted || !isAdminLoggedIn) return null;

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'processing': return 'text-blue-400 bg-blue-500/20';
      case 'completed': return 'text-emerald-400 bg-emerald-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
    }
  };

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-red-400">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage orders, users, and settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="text-blue-400" size={32} />
            </div>
            <div className="text-3xl font-bold mb-1">{orders.length}</div>
            <div className="text-sm text-gray-400">Total Orders</div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="text-yellow-400" size={32} />
            </div>
            <div className="text-3xl font-bold mb-1">{pendingOrders + processingOrders}</div>
            <div className="text-sm text-gray-400">Active Orders</div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-purple-400" size={32} />
            </div>
            <div className="text-3xl font-bold mb-1">{users.length}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="text-emerald-400" size={32} />
            </div>
            <div className="text-3xl font-bold mb-1">${totalRevenue}</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Orders Management</h2>
            <div className="flex space-x-2">
              {(['all', 'pending', 'processing', 'completed', 'cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === status
                      ? 'bg-red-500 text-white'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No orders found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-lg mb-1">Order #{order.id?.slice(0, 8) || 'N/A'}</div>
                      <div className="text-sm text-gray-400">
                        User: <span className="text-white">{order.username}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Date: {new Date(order.created_at || '').toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-400 mb-2">
                        ${order.total}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-sm font-semibold mb-2">Items:</div>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-400 ml-4">
                        • {item.type === 'cookie' 
                          ? `${item.exchange} Cookie - $${item.balance} balance` 
                          : `Card Load - ${item.cardName} - $${item.loadAmount}`
                        } - ${item.price}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleStatusChange(order.id, 'pending')}
                      className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded transition text-sm"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, 'processing')}
                      className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition text-sm"
                    >
                      Processing
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, 'completed')}
                      className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded transition text-sm"
                    >
                      <Check size={16} className="inline mr-1" />
                      Complete
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, 'cancelled')}
                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition text-sm"
                    >
                      <X size={16} className="inline mr-1" />
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="ml-auto px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition text-sm"
                    >
                      <Trash2 size={16} className="inline mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
