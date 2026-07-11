import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Plus, RefreshCw } from 'lucide-react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

interface AdminProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

interface AdminOrder {
  id: number;
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

  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    category: 'men',
    price: '',
    stock: '',
    image: '',
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

    if (!newProduct.name.trim() || !newProduct.brand.trim() || !newProduct.price || !newProduct.stock) {
      showMessage('Please fill in name, brand, price, and stock.');
      return;
    }

    setIsSubmittingProduct(true);

    try {
      const res = await fetch('http://127.0.0.1:5000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          brand: newProduct.brand,
          category: newProduct.category,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock, 10),
          image: newProduct.image || undefined,
        }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      showMessage('Product added.');
      setNewProduct({ name: '', brand: '', category: 'men', price: '', stock: '', image: '' });
      loadProducts();
    } catch (err) {
      console.error('Failed to add product:', err);
      showMessage('Failed to add product. Is the backend running?');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    // Optimistically update UI
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

    try {
      const res = await fetch(`http://127.0.0.1:5000/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      showMessage(`Order #${orderId} updated to "${newStatus}".`);
    } catch (err) {
      console.error('Failed to update order status:', err);
      showMessage('Failed to update order status.');
      loadOrders(); // revert to real state on failure
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink text-bone">
      <Nav />

      <main className="flex-grow pt-28 pb-24 max-w-6xl mx-auto px-6 w-full">
        <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black font-display uppercase tracking-tight text-bone">
              Admin Panel
            </h1>
            <p className="text-sm text-ash mt-2">Manage products and orders. No login required — internal use only.</p>
          </div>
          <button
            onClick={() => {
              loadProducts();
              loadOrders();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-bold uppercase tracking-wider text-bone transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-volt/10 border border-volt/30 text-volt text-sm font-semibold">
            {message}
          </div>
        )}

        {/* PRODUCTS SECTION */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
              <Package className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold font-display uppercase tracking-wider text-bone">
              Products ({products.length})
            </h2>
          </div>

          {/* Add product form */}
          <form
            onSubmit={handleAddProduct}
            className="mb-8 p-6 rounded-2xl border border-white/5 bg-white/[0.01] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
              className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
            />
            <input
              type="text"
              placeholder="Brand"
              value={newProduct.brand}
              onChange={(e) => setNewProduct((p) => ({ ...p, brand: e.target.value }))}
              className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}
              className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50"
            >
              <option value="men" className="bg-zinc">men</option>
              <option value="women" className="bg-zinc">women</option>
              <option value="children" className="bg-zinc">children</option>
            </select>
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
              className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct((p) => ({ ...p, stock: e.target.value }))}
              className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newProduct.image}
              onChange={(e) => setNewProduct((p) => ({ ...p, image: e.target.value }))}
              className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
            />
            <button
              type="submit"
              disabled={isSubmittingProduct}
              className="sm:col-span-2 lg:col-span-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {isSubmittingProduct ? 'Adding...' : 'Add Product'}
            </button>
          </form>

          {/* Products table */}
          {isLoadingProducts ? (
            <p className="text-sm text-ash">Loading products…</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/[0.02] text-ash text-xs uppercase font-mono">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Brand</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.01]">
                      <td className="px-4 py-3 font-mono text-ash">{p.id}</td>
                      <td className="px-4 py-3 font-semibold text-bone">{p.name}</td>
                      <td className="px-4 py-3 text-ash">{p.brand}</td>
                      <td className="px-4 py-3 text-ash">{p.category}</td>
                      <td className="px-4 py-3 font-mono text-bone">{p.price}</td>
                      <td className="px-4 py-3 font-mono text-ash">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ORDERS SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold font-display uppercase tracking-wider text-bone">
              Orders ({orders.length})
            </h2>
          </div>

          {isLoadingOrders ? (
            <p className="text-sm text-ash">Loading orders…</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-white/[0.02] text-ash text-xs uppercase font-mono">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Address</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/[0.01]">
                      <td className="px-4 py-3 font-mono text-ash">{o.id}</td>
                      <td className="px-4 py-3 font-semibold text-bone">{o.customer}</td>
                      <td className="px-4 py-3 text-ash">{o.phone}</td>
                      <td className="px-4 py-3 text-ash max-w-xs truncate">{o.address}</td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-bone focus:outline-none focus:border-volt/50 cursor-pointer"
                        >
                          {ALLOWED_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-zinc">
                              {s}
                            </option>
                          ))}
                        </select>
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
