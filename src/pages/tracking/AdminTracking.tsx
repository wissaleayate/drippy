import { useState } from 'react';
import { Search } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

const ALLOWED_STATUSES = ['Nouveau', 'Confirmé', 'Ne répond pas', 'Expédiée'];

export default function AdminTracking() {
  const { t, isRTL } = useLang();
  const [uuid, setUuid] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

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
    } catch {
      setError(t.admin_tracking_not_found);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update');

      setOrder((prev: any) => ({ ...prev, status: newStatus }));
      setStatusMsg(t.admin_tracking_updated);
      toast.success(t.admin_tracking_updated);
      setTimeout(() => setStatusMsg(''), 3000);
    } catch {
      toast.error(t.admin_tracking_update_failed);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-bone" dir={isRTL ? 'rtl' : 'ltr'}>
      <main className="pt-16 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:pt-12">
        <h1 className="text-2xl sm:text-3xl font-black font-display uppercase mb-8">
          {t.admin_tracking_title}
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-12">
          <input
            type="search"
            placeholder={t.admin_tracking_placeholder}
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            aria-label={t.admin_tracking_placeholder}
            className="flex-grow px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-bone focus:border-volt outline-none focus:ring-2 focus:ring-volt/30"
          />
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="tap-target bg-volt text-ink px-5 sm:px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-bone transition-all disabled:opacity-70 cursor-pointer"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">
              {loading ? t.admin_tracking_searching : t.admin_tracking_search}
            </span>
          </button>
        </form>

        {error && (
          <p className="text-red-400 mb-6" role="alert">{error}</p>
        )}

        {order && (
          <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl">
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-white/10 pb-6 gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">{t.admin_tracking_order_details}</h2>
                <p className="text-ash font-mono text-sm mt-1 break-all">{order.uuid}</p>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-volt/20 text-volt font-bold text-sm uppercase self-start sm:self-auto">
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <p className="text-ash">
                  {t.admin_tracking_customer}:
                  <span className="text-bone block text-base mt-0.5">{order.customer}</span>
                </p>
                <p className="text-ash">
                  {t.admin_tracking_phone}:
                  <span className="text-bone block text-base mt-0.5">{order.phone}</span>
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-ash">
                  {t.admin_tracking_address}:
                  <span className="text-bone block text-base mt-0.5">{order.address}</span>
                </p>
                <p className="text-ash">
                  {t.admin_tracking_total}:
                  <span className="text-bone block text-base mt-0.5">{order.total_price?.toLocaleString()} DA</span>
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-ash text-xs uppercase tracking-widest mb-4">{t.admin_tracking_update_status}</h3>
              <div className={`flex items-center gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.uuid, e.target.value)}
                  aria-label={t.admin_tracking_update_status}
                  className="tap-target px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-bone outline-none focus:border-volt focus:ring-2 focus:ring-volt/30"
                >
                  {ALLOWED_STATUSES.map((status) => (
                    <option key={status} value={status} className="bg-ink">{status}</option>
                  ))}
                </select>
                {statusMsg && (
                  <span className="text-volt text-xs font-semibold" role="status" aria-live="polite">
                    {statusMsg}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
