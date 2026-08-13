import { useState, useEffect } from 'react';
import { Package, Plus, RefreshCw, Copy, Trash2, Check, Star, Users as UsersIcon } from 'lucide-react';

interface AdminProduct {
  uuid: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  featured?: boolean;
}
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

interface AdminUser {
  id: number;
  uuid: string;
  name: string;
  email: string;
  created_at: string;
}

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('adminToken')}` };
}


// Utility function to generate EU size ranges based on category
function euSizeRange(category: string): string[] {
  if (category === 'children') {
    const sizes: string[] = [];
    for (let s = 15; s <= 39; s++) sizes.push(String(s));
    return sizes;
  }
  if (category === 'women') {
    const sizes: string[] = [];
    for (let s = 35; s <= 44; s++) sizes.push(String(s));
    return sizes;
  }
  // men
  const sizes: string[] = [];
  for (let s = 38; s <= 48; s++) sizes.push(String(s));
  return sizes;
}




export default function AdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [message, setMessage] = useState('');
  const [copiedUuid, setCopiedUuid] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: 'men',
    price: '',
    stock: '',
  });
  const [availableSizes, setAvailableSizes] = useState<string[]>(euSizeRange('men'));
  const [selectedSizes, setSelectedSizes] = useState<string[]>(euSizeRange('men'));




  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [promotions, setPromotions] = useState<AdminPromotion[]>([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);
  const [promoImageFile, setPromoImageFile] = useState<File | null>(null);
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
  const [deliveryRates, setDeliveryRates] = useState<AdminDeliveryRate[]>([]);
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  const [newRate, setNewRate] = useState({
    wilaya: 'Alger',
    home_price: '',
    pickup_price: '',
    delivery_time: '2 - 3 Days',
  });
  const [isSubmittingRate, setIsSubmittingRate] = useState(false);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const loadProducts = () => {
    setIsLoadingProducts(true);
    fetch('http://127.0.0.1:5000/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoadingProducts(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setIsLoadingProducts(false);
      });
  };

  const loadUsers = () => {
    setIsLoadingUsers(true);
    fetch('http://127.0.0.1:5000/admin/users', {
      headers: authHeader(),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setIsLoadingUsers(false);
      })
      .catch((err) => {
        console.error('Failed to load users:', err);
        setIsLoadingUsers(false);
      });
  };

  const handleCopyUuid = async (uuid: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(uuid);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = uuid;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedUuid(uuid);
      showMessage('UUID copied to clipboard.');
      setTimeout(() => setCopiedUuid(null), 2000);
    } catch (err) {
      console.error('Failed to copy UUID:', err);
      showMessage('Could not copy automatically. UUID: ' + uuid);
    }
};
  const handleToggleFeatured = async (uuid: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/products/uuid/${uuid}/featured`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setProducts((prev) => prev.map((p) => (p.uuid === uuid ? { ...p, featured: !currentFeatured } : p)));
      showMessage(!currentFeatured ? 'Product added to homepage.' : 'Product removed from homepage.');
    } catch (err) {
      console.error('Failed to toggle featured:', err);
      showMessage('Failed to update. Is the backend running?');
    }
  };

  
  const handleDeleteProduct = async (uuid: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/products/uuid/${uuid}`, {
        method: 'DELETE',
        headers: authHeader(),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      setProducts((prev) => prev.filter((p) => p.uuid !== uuid));
      showMessage(`"${name}" deleted successfully.`);
    } catch (err) {
      console.error('Failed to delete product:', err);
      showMessage('Failed to delete product. Is the backend running?');
    }
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

  useEffect(() => {
    loadProducts();
    loadPromotions();
    loadDeliveryRates();
    loadUsers();
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.brand.trim() || !newProduct.price || !newProduct.stock || !imageFile) {
      showMessage('Please fill all fields and select an image.');
      return;
    }
    setIsSubmittingProduct(true);
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('brand', newProduct.brand);
    formData.append('category', newProduct.category);
    formData.append('price', newProduct.price);
    formData.append('stock', newProduct.stock);
    formData.append('sizes', selectedSizes.join(','));
    formData.append('image', imageFile);

    try {
      const res = await fetch('http://127.0.0.1:5000/products', {
        method: 'POST',
        headers: authHeader(),
        body: formData,
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      showMessage('Product added.');
      setNewProduct({ name: '', brand: '', category: 'men', price: '', stock: '' });
      setAvailableSizes(euSizeRange('men'));
      setSelectedSizes(euSizeRange('men'));
      setImageFile(null); 
      loadProducts();
    } catch (err) {
      console.error('Failed to add product:', err);
      showMessage('Failed to add product.');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-bone">
      <main className="pt-8 pb-24 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display uppercase tracking-tight text-bone">Admin Panel</h1>
          <p className="text-sm text-ash mt-2">Manage products and orders.</p>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-volt/10 border border-volt/30 text-volt text-sm font-semibold" role="status" aria-live="polite">
            {message}
          </div>
        )}

        <section className="mb-16" aria-labelledby="products-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt" aria-hidden="true">
              <Package className="w-4 h-4" />
            </div>
            <h2 id="products-heading" className="text-xl font-bold font-display uppercase tracking-wider text-bone">Products ({products.length})</h2>
          </div>

          <form onSubmit={handleAddProduct} className="mb-8 p-5 sm:p-6 rounded-2xl border border-white/5 bg-white/[0.01] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Add product form">
            <input type="text" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Product name" />
            <input type="text" placeholder="Brand" value={newProduct.brand} onChange={(e) => setNewProduct((p) => ({ ...p, brand: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Brand" />
            <select
              value={newProduct.category}
              onChange={(e) => {
                const newCategory = e.target.value;
                setNewProduct((p) => ({ ...p, category: newCategory }));
                const range = euSizeRange(newCategory);
                setAvailableSizes(range);
                setSelectedSizes(range);
              }}
              className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50"
              aria-label="Category"
            >
              <option value="men" className="bg-zinc">men</option>
              <option value="women" className="bg-zinc">women</option>
              <option value="children" className="bg-zinc">children</option>
            </select>
            <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Price" min="0" />
            <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct((p) => ({ ...p, stock: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" aria-label="Stock" min="0" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-volt file:text-ink file:text-xs"
              aria-label="Product image"
            />

            <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ash uppercase tracking-wider">
                  Available EU Sizes ({newProduct.category})
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSizes(availableSizes)}
                    className="text-[10px] text-volt hover:underline cursor-pointer"
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSizes([])}
                    className="text-[10px] text-ash hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-lg bg-white/[0.02] border border-white/10">
                {availableSizes.map((size) => {
                  const isChecked = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setSelectedSizes((prev) =>
                          isChecked ? prev.filter((s) => s !== size) : [...prev, size]
                        )
                      }
                      className={`h-7 min-w-[32px] px-1.5 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-volt border-volt text-ink'
                          : 'bg-white/[0.03] border-white/10 text-ash hover:border-white/20'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-ash">
                Auto-suggested for "{newProduct.category}" — click to check/uncheck what's actually in stock.
              </p>
            </div>

            <button type="submit" disabled={isSubmittingProduct} className="sm:col-span-2 lg:col-span-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer disabled:opacity-50 tap-target">
              <Plus className="w-4 h-4" aria-hidden="true" /> {isSubmittingProduct ? 'Adding...' : 'Add Product'}
            </button>
          </form>

          {isLoadingProducts ? <p className="text-sm text-ash" aria-live="polite">Loading...</p> : (
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-white/[0.02] text-ash text-xs uppercase font-mono">
                    <th className="px-4 py-3" scope="col">UUID</th>
                    <th className="px-4 py-3" scope="col">Name</th>
                    <th className="px-4 py-3" scope="col">Brand</th>
                    <th className="px-4 py-3" scope="col">Price</th>
                    <th className="px-4 py-3" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p.uuid}>
                      <td className="px-4 py-3 text-ash text-xs font-mono truncate max-w-[120px]" title={p.uuid}>{p.uuid?.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-bone">{p.name}</td>
                      <td className="px-4 py-3 text-ash">{p.brand}</td>
                      <td className="px-4 py-3 text-bone font-mono">{p.price} DA</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => p.uuid && handleCopyUuid(p.uuid)}
                            className={`p-2 rounded-lg border transition-all cursor-pointer tap-target ${
                              copiedUuid === p.uuid
                                ? 'bg-volt/10 border-volt/30 text-volt'
                                : 'bg-white/[0.02] border-white/10 text-ash hover:text-bone hover:border-white/20'
                            }`}
                            title="Copy UUID"
                            aria-label={copiedUuid === p.uuid ? 'Copied!' : 'Copy UUID'}
                          >
                            {copiedUuid === p.uuid ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(p.uuid, !!p.featured)}
                            className={`p-2 rounded-lg border transition-all cursor-pointer tap-target ${
                              p.featured
                                ? 'bg-volt/10 border-volt/30 text-volt'
                                : 'bg-white/[0.02] border-white/10 text-ash hover:text-bone hover:border-white/20'
                            }`}
                            title={p.featured ? 'Remove from homepage' : 'Show on homepage'}
                            aria-label={p.featured ? `Remove ${p.name} from homepage` : `Show ${p.name} on homepage`}
                          >
                            <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-volt' : ''}`} />
                          </button>
                          <button
                            onClick={() => p.uuid && handleDeleteProduct(p.uuid, p.name)}
                            className="p-2 rounded-lg border border-white/10 bg-white/[0.02] text-ash hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer tap-target"
                            title="Delete product"
                            aria-label={`Delete ${p.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mb-16" aria-labelledby="promotions-heading">
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

        <section className="mb-16" aria-labelledby="delivery-heading">
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

        <section className="mb-16" aria-labelledby="users-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt" aria-hidden="true">
              <UsersIcon className="w-4 h-4" />
            </div>
            <h2 id="users-heading" className="text-xl font-bold font-display uppercase tracking-wider text-bone">Registered Users ({users.length})</h2>
          </div>

          {isLoadingUsers ? <p className="text-sm text-ash" aria-live="polite">Loading...</p> : (
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-white/[0.02] text-ash text-xs uppercase font-mono">
                    <th className="px-4 py-3" scope="col">Name</th>
                    <th className="px-4 py-3" scope="col">Email</th>
                    <th className="px-4 py-3" scope="col">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.uuid}>
                      <td className="px-4 py-3 text-bone">{u.name}</td>
                      <td className="px-4 py-3 text-ash">{u.email}</td>
                      <td className="px-4 py-3 text-ash font-mono text-xs">{u.created_at}</td>
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