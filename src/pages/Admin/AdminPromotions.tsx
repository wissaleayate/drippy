import { useState, useEffect } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';

interface AdminPromotion {
  uuid: string;
  tag: string;
  subtitle: string;
  title_line1: string;
  title_line2: string;
  description: string;
  button_text: string;
  button_link: string;
  image: string;
  display_order: number;
}

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('adminToken')}` };
}

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<AdminPromotion[]>([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);
  const [promoImageFile, setPromoImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [newPromotion, setNewPromotion] = useState({
    tag: 'NEW DROP',
    subtitle: '',
    title_line1: '',
    title_line2: '',
    description: '',
    button_text: 'EXPLORE DROP',
    button_link: '/products',
    display_order: '0',
  });
  const [isSubmittingPromotion, setIsSubmittingPromotion] = useState(false);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const loadPromotions = () => {
    setIsLoadingPromotions(true);
    fetch('http://127.0.0.1:5000/promotions')
      .then((res) => res.json())
      .then((data) => {
        setPromotions(data);
        setIsLoadingPromotions(false);
      })
      .catch((err) => {
        console.error('Failed to load promotions:', err);
        setIsLoadingPromotions(false);
      });
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleAddPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromotion.title_line1.trim() || !promoImageFile) {
      showMessage('Please fill at least the title and select an image.');
      return;
    }
    setIsSubmittingPromotion(true);
    const formData = new FormData();
    formData.append('tag', newPromotion.tag);
    formData.append('subtitle', newPromotion.subtitle);
    formData.append('title_line1', newPromotion.title_line1);
    formData.append('title_line2', newPromotion.title_line2);
    formData.append('description', newPromotion.description);
    formData.append('button_text', newPromotion.button_text);
    formData.append('button_link', newPromotion.button_link);
    formData.append('display_order', newPromotion.display_order);
    formData.append('image', promoImageFile);

    try {
      const res = await fetch('http://127.0.0.1:5000/promotions', {
        method: 'POST',
        headers: authHeader(),
        body: formData,
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      showMessage('Promotion added.');
      setNewPromotion({ tag: 'NEW DROP', subtitle: '', title_line1: '', title_line2: '', description: '', button_text: 'EXPLORE DROP', button_link: '/products', display_order: '0' });
      setPromoImageFile(null);
      loadPromotions();
    } catch (err) {
      console.error('Failed to add promotion:', err);
      showMessage('Failed to add promotion.');
    } finally {
      setIsSubmittingPromotion(false);
    }
  };

  const handleDeletePromotion = async (uuid: string, title: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/promotions/uuid/${uuid}`, {
        method: 'DELETE',
        headers: authHeader(),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setPromotions((prev) => prev.filter((p) => p.uuid !== uuid));
      showMessage(`"${title}" deleted successfully.`);
    } catch (err) {
      console.error('Failed to delete promotion:', err);
      showMessage('Failed to delete promotion. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen bg-ink text-bone">
      <main className="pt-8 pb-24 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display uppercase tracking-tight text-bone">Promotions</h1>
          <p className="text-sm text-ash mt-2">Manage homepage promotional banners.</p>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-volt/10 border border-volt/30 text-volt text-sm font-semibold" role="status" aria-live="polite">
            {message}
          </div>
        )}

        <section aria-labelledby="promotions-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt" aria-hidden="true">
              <Package className="w-4 h-4" />
            </div>
            <h2 id="promotions-heading" className="text-xl font-bold font-display uppercase tracking-wider text-bone">Homepage Promotions ({promotions.length})</h2>
          </div>

          <form onSubmit={handleAddPromotion} className="mb-8 p-5 sm:p-6 rounded-2xl border border-white/5 bg-white/[0.01] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Add promotion form">
            <input type="text" placeholder="Tag (e.g. NEW DROP)" value={newPromotion.tag} onChange={(e) => setNewPromotion((p) => ({ ...p, tag: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Tag" />
            <input type="text" placeholder="Subtitle (e.g. New Balance / Collection 01)" value={newPromotion.subtitle} onChange={(e) => setNewPromotion((p) => ({ ...p, subtitle: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Subtitle" />
            <input type="number" placeholder="Display Order (0 = first)" value={newPromotion.display_order} onChange={(e) => setNewPromotion((p) => ({ ...p, display_order: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Display order" min="0" />
            <input type="text" placeholder="Title Line 1 (e.g. STEP)" value={newPromotion.title_line1} onChange={(e) => setNewPromotion((p) => ({ ...p, title_line1: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Title line 1" />
            <input type="text" placeholder="Title Line 2 (e.g. INTO STYLE)" value={newPromotion.title_line2} onChange={(e) => setNewPromotion((p) => ({ ...p, title_line2: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Title line 2" />
            <input type="text" placeholder="Button Text" value={newPromotion.button_text} onChange={(e) => setNewPromotion((p) => ({ ...p, button_text: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Button text" />
            <input type="text" placeholder="Button Link (e.g. /products)" value={newPromotion.button_link} onChange={(e) => setNewPromotion((p) => ({ ...p, button_link: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Button link" />
            <textarea placeholder="Description" value={newPromotion.description} onChange={(e) => setNewPromotion((p) => ({ ...p, description: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50 sm:col-span-2 lg:col-span-2" rows={1} aria-label="Description" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPromoImageFile(e.target.files?.[0] || null)}
              className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-volt file:text-ink file:text-xs"
              aria-label="Promotion image"
            />
            <button type="submit" disabled={isSubmittingPromotion} className="sm:col-span-2 lg:col-span-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer disabled:opacity-50 tap-target">
              <Plus className="w-4 h-4" aria-hidden="true" /> {isSubmittingPromotion ? 'Adding...' : 'Add Promotion'}
            </button>
          </form>

          {isLoadingPromotions ? <p className="text-sm text-ash" aria-live="polite">Loading...</p> : (
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-white/[0.02] text-ash text-xs uppercase font-mono">
                    <th className="px-4 py-3" scope="col">Image</th>
                    <th className="px-4 py-3" scope="col">Title</th>
                    <th className="px-4 py-3" scope="col">Tag</th>
                    <th className="px-4 py-3" scope="col">Order</th>
                    <th className="px-4 py-3" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {promotions.map((promo) => (
                    <tr key={promo.uuid}>
                      <td className="px-4 py-3">
                        <img src={promo.image} alt={promo.title_line1} className="w-14 h-10 object-cover rounded-md border border-white/10" />
                      </td>
                      <td className="px-4 py-3 text-bone">{promo.title_line1} {promo.title_line2}</td>
                      <td className="px-4 py-3 text-ash">{promo.tag}</td>
                      <td className="px-4 py-3 text-ash">{promo.display_order}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeletePromotion(promo.uuid, `${promo.title_line1} ${promo.title_line2}`)}
                          className="p-2 rounded-lg border border-white/10 bg-white/[0.02] text-ash hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer tap-target"
                          title="Delete promotion"
                          aria-label={`Delete ${promo.title_line1}`}
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