import { useEffect, useState } from 'react';
import toast from 'react-hot-toast'; // <--- ADD THIS
import { ShieldAlert, RefreshCw, ShoppingBag, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Order {
  id: number;
  customer: string;
  phone: string;
  address: string;
  status: string; // 'Pending' | 'Confirmed' | 'Cancelled' | 'Confirmé' | 'Nouveau' | 'Ne répond pas'
  items: string; // JSON string
  total_price: number;
  created_at: string;
}

function formatDA(n: number) {
  return `${n.toLocaleString('en-US', { maximumFractionDigits: 0 })} DA`;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // ---> NEW FILTER STATE <---
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'unconfirmed'>('all');

  // 1. Fetch all orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Update order status action handler
  const handleUpdateStatus = async (orderId: number, newStatus: 'Confirmed' | 'Cancelled' | 'Pending') => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`http://127.0.0.1:5000/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      },
      body: JSON.stringify({ status: newStatus }),
  });

      if (!res.ok) throw new Error('Failed to update order status');

      // 1. Success Message
      toast.success(`Order ${newStatus} successfully!`);

      // 2. Refresh the list automatically
      fetchOrders(); 
      
    } catch (err: any) {
      toast.error('Could not update status'); // Added toast error
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper to parse JSON items safely
  const parseItems = (itemsStr: string) => {
    try {
      return JSON.parse(itemsStr);
    } catch {
      return [];
    }
  };

  // Helper to get status styling classes (handles both languages)
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'confirmé':
        return 'bg-volt/10 text-volt border-volt/20';
      case 'cancelled':
      case 'ne répond pas':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  // ---> CONDITIONAL ARRAY FILTERING LOGIC <---
  const filteredOrders = orders.filter((order) => {
    const status = order.status?.toLowerCase() || 'pending';
    const isConfirmed = status === 'confirmed' || status === 'confirmé';
    
    if (statusFilter === 'confirmed') return isConfirmed;
    if (statusFilter === 'unconfirmed') return !isConfirmed; // Shows Pending/Nouveau and Cancelled
    return true; // Shows everything when 'all' is toggled
  });

  return (
    <div className="min-h-screen bg-ink text-bone p-4 sm:p-6 md:p-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-volt/10 text-volt tracking-wider">
              Admin Portal Only
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Manage Orders</h1>
          <p className="text-xs text-ash">Review, track, and manage client orders.</p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-white/[0.03] border border-white/10 hover:bg-white/5 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 tap-target"
          aria-label="Refresh orders"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Refresh Orders
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading && (
          <div className="text-center py-20 text-sm text-ash font-mono animate-pulse">
            Loading orders from system...
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-xs mb-6">
            <ShieldAlert className="w-5 h-5" />
            <span>{error}. Is the backend Flask server running?</span>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.01]">
            <ShoppingBag className="w-8 h-8 text-ash mx-auto mb-3" />
            <p className="text-sm font-bold">No orders found</p>
            <p className="text-xs text-ash">Once customers buy products, they'll appear here.</p>
          </div>
        )}

        {/* ---> FILTER SELECTION TABS BAR <--- */}
        {!loading && !error && orders.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 bg-white/[0.01] p-1.5 rounded-2xl border border-white/5 w-fit font-mono text-[11px]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl transition-all font-bold uppercase tracking-wider cursor-pointer ${
                statusFilter === 'all' 
                  ? 'bg-white/10 text-bone' 
                  : 'text-ash hover:text-bone'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-4 py-2 rounded-xl transition-all font-bold uppercase tracking-wider cursor-pointer ${
                statusFilter === 'confirmed' 
                  ? 'bg-volt/10 text-volt border border-volt/20' 
                  : 'text-ash hover:text-bone'
              }`}
            >
              Confirmed ({orders.filter(o => {
                const s = o.status?.toLowerCase();
                return s === 'confirmed' || s === 'confirmé';
              }).length})
            </button>
            <button
              onClick={() => setStatusFilter('unconfirmed')}
              className={`px-4 py-2 rounded-xl transition-all font-bold uppercase tracking-wider cursor-pointer ${
                statusFilter === 'unconfirmed' 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                  : 'text-ash hover:text-bone'
              }`}
            >
              Unconfirmed ({orders.filter(o => {
                const s = o.status?.toLowerCase();
                return s !== 'confirmed' && s !== 'confirmé';
              }).length})
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && orders.length > 0 && (
          <div className="overflow-x-auto border border-white/5 rounded-2xl bg-zinc/40 backdrop-blur-sm">
            <table className="w-full text-left border-collapse text-xs min-w-[900px]">
              <thead>
                <tr className="bg-white/[0.02] text-ash text-[10px] uppercase tracking-wider border-b border-white/5 font-mono">
                  <th className="px-4 sm:px-6 py-4" scope="col">N° of Order</th>
                  <th className="px-4 sm:px-6 py-4" scope="col">Customer</th>
                  <th className="px-4 sm:px-6 py-4" scope="col">Delivery Address</th>
                  <th className="px-4 sm:px-6 py-4" scope="col">Items Purchased</th>
                  <th className="px-4 sm:px-6 py-4" scope="col">Total Price</th>
                  <th className="px-4 sm:px-6 py-4" scope="col">Current Status</th>
                  <th className="px-4 sm:px-6 py-4" scope="col">Actions</th>
                  <th className="px-4 sm:px-6 py-4 text-right" scope="col">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredOrders.map((order) => {
                  const items = parseItems(order.items);
                  const currentStatus = order.status || 'Pending';
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                      {/* Order Number */}
                      <td className="px-6 py-4 font-mono font-bold text-volt">
                        #{order.id}
                      </td>

                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-bone">{order.customer}</div>
                        <div className="text-ash font-mono text-[11px]">{order.phone}</div>
                      </td>

                      {/* Delivery Address */}
                      <td className="px-6 py-4 text-ash max-w-[180px] truncate" title={order.address}>
                        {order.address}
                      </td>

                      {/* Items Purchased Details */}
                      <td className="px-6 py-4 max-w-xs">
                        <div className="space-y-1">
                          {items.map((item: any, idx: number) => (
                            <div key={idx} className="text-[11px] text-ash flex justify-between bg-white/[0.02] px-2 py-1 rounded border border-white/5 gap-4">
                              <span>
                                <strong className="text-bone">{item.name}</strong> (Size: {item.size})
                              </span>
                              <span className="font-mono text-[10px] text-volt shrink-0">
                                x{item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total Price */}
                      <td className="px-6 py-4 font-mono font-bold text-bone">
                        {formatDA(order.total_price)}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(currentStatus)}`}>
                          {(currentStatus.toLowerCase() === 'confirmed' || currentStatus.toLowerCase() === 'confirmé') && <CheckCircle className="w-3 h-3" />}
                          {(currentStatus.toLowerCase() === 'cancelled' || currentStatus.toLowerCase() === 'ne répond pas') && <XCircle className="w-3 h-3" />}
                          {currentStatus.toLowerCase() !== 'confirmed' && currentStatus.toLowerCase() !== 'confirmé' && currentStatus.toLowerCase() !== 'cancelled' && currentStatus.toLowerCase() !== 'ne répond pas' && <Clock className="w-3 h-3 animate-pulse" />}
                          {currentStatus}
                        </span>
                      </td>

                      {/* Action Dropdown Selection tool */}
                      <td className="px-6 py-4">
                        <select
                          disabled={isUpdating}
                          value={currentStatus}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as any)}
                          className="bg-black/40 border border-white/10 text-ash text-[11px] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-volt/50 disabled:opacity-40 transition-colors cursor-pointer font-mono"
                        >
                          <option value="Pending">⏱️ Pending</option>
                          <option value="Confirmed">✅ Confirm</option>
                          <option value="Cancelled">❌ Cancel</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-right text-ash font-mono text-[11px]">
                        {order.created_at}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}