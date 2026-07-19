  import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, RefreshCw, Copy, Trash2, Check } from 'lucide-react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

interface AdminProduct {
  uuid: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

interface AdminOrder {
  id: number;
  uuid?: string;
  customer: string;
  phone: string;
  address: string;
  status: string;
}

const ALLOWED_STATUSES = ['Nouveau', 'Confirmé', 'Ne répond pas', 'Expédiée'];

export default function AdminPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
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
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

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

  const handleCopyUuid = async (uuid: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(uuid);
      } else {
        // Fallback for browsers/contexts that block the Clipboard API
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

  const handleDeleteProduct = async (uuid: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/products/uuid/${uuid}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      setProducts((prev) => prev.filter((p) => p.uuid !== uuid));
      showMessage(`"${name}" deleted successfully.`);
    } catch (err) {
      console.error('Failed to delete product:', err);
      showMessage('Failed to delete product. Is the backend running?');
    }
  };

  const loadOrders = () => {
    setIsLoadingOrders(true);
    fetch('http://127.0.0.1:5000/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setIsLoadingOrders(false);
      })
      .catch((err) => {
        console.error('Failed to load orders:', err);
        setIsLoadingOrders(false);
      });
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
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
    formData.append('image', imageFile);

    try {
      const res = await fetch('http://127.0.0.1:5000/products', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      showMessage('Product added.');
      setNewProduct({ name: '', brand: '', category: 'men', price: '', stock: '' });
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
    <div className="min-h-screen flex flex-col bg-ink text-bone">
      <Nav />
      <main className="flex-grow pt-28 pb-24 max-w-6xl mx-auto px-6 w-full">
        <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black font-display uppercase tracking-tight text-bone">Admin Panel</h1>
            <p className="text-sm text-ash mt-2">Manage products and orders.</p>
          </div>
          <button onClick={() => { loadProducts(); loadOrders(); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-bold uppercase tracking-wider text-bone transition-all cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
         <Link 
          to="/admin/orders" 
          className="p-6 rounded-2xl bg-volt text-ink hover:bg-bone transition-all flex items-center justify-between font-mono uppercase tracking-wider"
         >
          <span className="font-bold text-lg">Manage Orders</span>
          <span className="text-2xl">→</span>
         </Link>
        {/* --- ADDED TRACKING NAVIGATION LINK --- */}
          <Link 
            to="/admin/tracking" 
            className="p-6 rounded-2xl bg-volt text-ink hover:bg-bone transition-all flex items-center justify-between font-mono uppercase tracking-wider"
          >
            <span className="font-bold text-lg">Manage Shipment Tracking</span>
            <span className="text-2xl">→</span>
          </Link>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-volt/10 border border-volt/30 text-volt text-sm font-semibold">
            {message}
          </div>
        )}

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
              <Package className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold font-display uppercase tracking-wider text-bone">Products ({products.length})</h2>
          </div>

          <form onSubmit={handleAddProduct} className="mb-8 p-6 rounded-2xl border border-white/5 bg-white/[0.01] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" />
            <input type="text" placeholder="Brand" value={newProduct.brand} onChange={(e) => setNewProduct((p) => ({ ...p, brand: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" />
            <select value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50">
              <option value="men" className="bg-zinc">men</option>
              <option value="women" className="bg-zinc">women</option>
              <option value="children" className="bg-zinc">children</option>
            </select>
            <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" />
            <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct((p) => ({ ...p, stock: e.target.value }))} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-volt file:text-ink file:text-xs"
            />
            <button type="submit" disabled={isSubmittingProduct} className="sm:col-span-2 lg:col-span-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer disabled:opacity-50">
              <Plus className="w-4 h-4" /> {isSubmittingProduct ? 'Adding...' : 'Add Product'}
            </button>
          </form>

          {isLoadingProducts ? <p className="text-sm text-ash">Loading...</p> : (
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/[0.02] text-ash text-xs uppercase font-mono">
                    <th className="px-4 py-3">UUID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Brand</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p.uuid}>
                      <td className="px-4 py-3 text-ash">{p.uuid}</td>
                      <td className="px-4 py-3 text-bone">{p.name}</td>
                      <td className="px-4 py-3 text-ash">{p.brand}</td>
                      <td className="px-4 py-3 text-bone">{p.price}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => p.uuid && handleCopyUuid(p.uuid)}
                            className={`p-2 rounded-lg border transition-all cursor-pointer ${
                              copiedUuid === p.uuid
                                ? 'bg-volt/10 border-volt/30 text-volt'
                                : 'bg-white/[0.02] border-white/10 text-ash hover:text-bone hover:border-white/20'
                            }`}
                            title="Copy UUID"
                          >
                            {copiedUuid === p.uuid ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => p.uuid && handleDeleteProduct(p.uuid, p.name)}
                            className="p-2 rounded-lg border border-white/10 bg-white/[0.02] text-ash hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer"
                            title="Delete product"
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
      </main>
      <Footer />
    </div>
  );
}
