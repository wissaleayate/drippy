import { useState } from 'react';
import { Search } from 'lucide-react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
const ALLOWED_STATUSES = ['Nouveau', 'Confirmé', 'Ne répond pas', 'Expédiée'];

export default function AdminTracking() {
  const [uuid, setUuid] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uuid.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      const res = await fetch(`http://127.0.0.1:5000/orders/${uuid}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError('No order found with this UUID');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (uuid: string, newStatus: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/orders/${uuid}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error('Failed to update');
      
      setOrder((prev: any) => ({ ...prev, status: newStatus }));
      alert("Status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-ink text-bone">
      <Nav />
      <main className="pt-28 pb-24 max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-black font-display uppercase mb-8">Admin Tracking Panel</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-12">
          <input
            type="text"
            placeholder="Enter Order UUID..."
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            className="flex-grow px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-bone focus:border-volt outline-none"
          />
          <button type="submit" className="bg-volt text-ink px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all">
            <Search className="w-4 h-4" />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p className="text-red-400 mb-6">{error}</p>}

        {order && (
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-ash font-mono text-sm mt-1">{order.uuid}</p>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-volt/20 text-volt font-bold text-sm uppercase">
                {order.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <p className="text-ash">Customer: <span className="text-bone block text-base">{order.customer}</span></p>
                <p className="text-ash">Phone: <span className="text-bone block text-base">{order.phone}</span></p>
              </div>
              <div className="space-y-4">
                <p className="text-ash">Address: <span className="text-bone block text-base">{order.address}</span></p>
                <p className="text-ash">Total Price: <span className="text-bone block text-base">{order.total_price} DZD</span></p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-ash text-xs uppercase tracking-widest mb-4">Update Order Status</h3>
              <div className="flex gap-4">
                <select 
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.uuid, e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-bone outline-none focus:border-volt"
                >
                  {ALLOWED_STATUSES.map((status) => (
                    <option key={status} value={status} className="bg-ink">{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}