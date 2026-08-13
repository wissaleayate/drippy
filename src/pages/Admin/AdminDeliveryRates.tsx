import { useState, useEffect } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';

const ALGERIA_WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', "M'Sila", 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane', "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès",
  "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
];

interface AdminDeliveryRate {
  uuid: string;
  wilaya: string;
  home_price: number;
  pickup_price: number;
  delivery_time: string;
}

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('adminToken')}` };
}

export default function AdminDeliveryRates() {
  const [deliveryRates, setDeliveryRates] = useState<AdminDeliveryRate[]>([]);
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  const [message, setMessage] = useState('');
  const [newRate, setNewRate] = useState({
    wilaya: 'Alger',
    home_price: '',
    pickup_price: '',
    delivery_time: '2 - 3 Days',
  });
  const [isSubmittingRate, setIsSubmittingRate] = useState(false);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const loadDeliveryRates = () => {
    setIsLoadingRates(true);
    fetch('http://127.0.0.1:5000/delivery-rates')
      .then((res) => res.json())
      .then((data) => {
        setDeliveryRates(data);
        setIsLoadingRates(false);
      })
      .catch((err) => {
        console.error('Failed to load delivery rates:', err);
        setIsLoadingRates(false);
      });
  };

  useEffect(() => {
    loadDeliveryRates();
  }, []);

  const handleAddRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRate.home_price || !newRate.pickup_price) {
      showMessage('Please fill in both prices.');
      return;
    }
    setIsSubmittingRate(true);
    try {
      const res = await fetch('http://127.0.0.1:5000/delivery-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({
          wilaya: newRate.wilaya,
          home_price: newRate.home_price,
          pickup_price: newRate.pickup_price,
          delivery_time: newRate.delivery_time,
        }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      showMessage(`Delivery rate for ${newRate.wilaya} saved.`);
      setNewRate({ wilaya: 'Alger', home_price: '', pickup_price: '', delivery_time: '2 - 3 Days' });
      loadDeliveryRates();
    } catch (err) {
      console.error('Failed to save delivery rate:', err);
      showMessage('Failed to save delivery rate.');
    } finally {
      setIsSubmittingRate(false);
    }
  };

  const handleDeleteRate = async (uuid: string, wilaya: string) => {
    const confirmed = window.confirm(`Remove delivery pricing for "${wilaya}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/delivery-rates/uuid/${uuid}`, {
        method: 'DELETE',
        headers: authHeader(),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setDeliveryRates((prev) => prev.filter((r) => r.uuid !== uuid));
      showMessage(`Delivery pricing for "${wilaya}" removed.`);
    } catch (err) {
      console.error('Failed to delete delivery rate:', err);
      showMessage('Failed to delete delivery rate.');
    }
  };

  return (
    <div className="min-h-screen bg-ink text-bone">
      <main className="pt-8 pb-24 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display uppercase tracking-tight text-bone">Delivery Rates</h1>
          <p className="text-sm text-ash mt-2">Set shipping prices per wilaya.</p>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-volt/10 border border-volt/30 text-volt text-sm font-semibold" role="status" aria-live="polite">
            {message}
          </div>
        )}

        <section aria-labelledby="delivery-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt" aria-hidden="true">
              <Package className="w-4 h-4" />
            </div>
            <h2 id="delivery-heading" className="text-xl font-bold font-display uppercase tracking-wider text-bone">Delivery Rates ({deliveryRates.length})</h2>
          </div>

          <form onSubmit={handleAddRate} className="mb-8 p-5 sm:p-6 rounded-2xl border border-white/5 bg-white/[0.01] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Add or update delivery rate form">
            <select value={newRate.wilaya} onChange={(e) => setNewRate((r) => ({ ...r, wilaya: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Wilaya">
              {ALGERIA_WILAYAS.map((w) => (
                <option key={w} value={w} className="bg-zinc">{w}</option>
              ))}
            </select>
            <input type="number" placeholder="Home Delivery Price (DA)" value={newRate.home_price} onChange={(e) => setNewRate((r) => ({ ...r, home_price: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Home delivery price" min="0" />
            <input type="number" placeholder="Pickup Point Price (DA)" value={newRate.pickup_price} onChange={(e) => setNewRate((r) => ({ ...r, pickup_price: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Pickup point price" min="0" />
            <input type="text" placeholder="Delivery Time (e.g. 2 - 3 Days)" value={newRate.delivery_time} onChange={(e) => setNewRate((r) => ({ ...r, delivery_time: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Delivery time" />
            <button type="submit" disabled={isSubmittingRate} className="sm:col-span-2 lg:col-span-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer disabled:opacity-50 tap-target">
              <Plus className="w-4 h-4" aria-hidden="true" /> {isSubmittingRate ? 'Saving...' : 'Save Delivery Rate'}
            </button>
          </form>
          <p className="text-xs text-ash mb-4 -mt-4">Tip: selecting a wilaya that already has a rate will update it instead of creating a duplicate.</p>

          {isLoadingRates ? <p className="text-sm text-ash" aria-live="polite">Loading...</p> : (
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-white/[0.02] text-ash text-xs uppercase font-mono">
                    <th className="px-4 py-3" scope="col">Wilaya</th>
                    <th className="px-4 py-3" scope="col">Home (DA)</th>
                    <th className="px-4 py-3" scope="col">Pickup (DA)</th>
                    <th className="px-4 py-3" scope="col">Time</th>
                    <th className="px-4 py-3" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {deliveryRates.map((rate) => (
                    <tr key={rate.uuid}>
                      <td className="px-4 py-3 text-bone font-semibold">{rate.wilaya}</td>
                      <td className="px-4 py-3 text-bone font-mono">{rate.home_price}</td>
                      <td className="px-4 py-3 text-ash font-mono">{rate.pickup_price}</td>
                      <td className="px-4 py-3 text-ash">{rate.delivery_time}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteRate(rate.uuid, rate.wilaya)}
                          className="p-2 rounded-lg border border-white/10 bg-white/[0.02] text-ash hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer tap-target"
                          title="Delete delivery rate"
                          aria-label={`Delete rate for ${rate.wilaya}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
