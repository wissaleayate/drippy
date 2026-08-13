import { useState, useEffect } from 'react';
import { Package, Plus, Copy, Trash2, Check, Star, Pencil, X } from 'lucide-react';

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
  const sizes: string[] = [];
  for (let s = 38; s <= 48; s++) sizes.push(String(s));
  return sizes;
}

function authHeader() {
  return { Authorization: `Bearer ${localStorage.getItem('adminToken')}` };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [message, setMessage] = useState('');
  const [copiedUuid, setCopiedUuid] = useState<string | null>(null);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [editStock, setEditStock] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
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

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

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

  useEffect(() => {
    loadProducts();
  }, []);

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

  const startEditing = (p: AdminProduct) => {
    setEditingUuid(p.uuid);
    setEditStock(String(p.stock));
    setEditPrice(String(p.price));
  };

  const cancelEditing = () => {
    setEditingUuid(null);
    setEditStock('');
    setEditPrice('');
  };

  const saveEdit = async (uuid: string) => {
    setIsSavingEdit(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/products/uuid/${uuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ stock: editStock, price: editPrice }),
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.uuid === uuid ? { ...p, stock: updated.stock, price: updated.price } : p)));
      showMessage('Product updated.');
      cancelEditing();
    } catch (err) {
      console.error('Failed to update product:', err);
      showMessage('Failed to update product. Is the backend running?');
    } finally {
      setIsSavingEdit(false);
    }
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
    extraImageFiles.forEach((file) => formData.append('extra_images', file));

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
      setExtraImageFiles([]);
      setFileInputKey((k) => k + 1);
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display uppercase tracking-tight text-bone">Products</h1>
          <p className="text-sm text-ash mt-2">Manage your product catalog.</p>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-volt/10 border border-volt/30 text-volt text-sm font-semibold" role="status" aria-live="polite">
            {message}
          </div>
        )}

        <section aria-labelledby="products-heading">
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

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ash uppercase tracking-wider">
                Main Image
              </label>
              <input
                key={`main-image-${fileInputKey}`}
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-volt file:text-ink file:text-xs"
                aria-label="Product image"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-ash uppercase tracking-wider">
                Additional Gallery Photos (optional)
              </label>
              <input
                key={`extra-images-${fileInputKey}`}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setExtraImageFiles(Array.from(e.target.files ?? []))}
                className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-volt file:text-ink file:text-xs"
                aria-label="Additional product images"
              />
              {extraImageFiles.length > 0 && (
                <p className="text-[10px] text-ash">{extraImageFiles.length} additional photo(s) selected</p>
              )}
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ash uppercase tracking-wider">
                  Available EU Sizes ({newProduct.category})
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSelectedSizes(availableSizes)} className="text-[10px] text-volt hover:underline cursor-pointer">
                    Select all
                  </button>
                  <button type="button" onClick={() => setSelectedSizes([])} className="text-[10px] text-ash hover:underline cursor-pointer">
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
                    <th className="px-4 py-3" scope="col">Stock</th>
                    <th className="px-4 py-3" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => {
                    const isEditing = editingUuid === p.uuid;
                    return (
                      <tr key={p.uuid}>
                        <td className="px-4 py-3 text-ash text-xs font-mono truncate max-w-[120px]" title={p.uuid}>{p.uuid?.slice(0, 8)}…</td>
                        <td className="px-4 py-3 text-bone">{p.name}</td>
                        <td className="px-4 py-3 text-ash">{p.brand}</td>
                        <td className="px-4 py-3 text-bone font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-24 px-2 py-1 rounded-md bg-white/[0.05] border border-volt/40 text-bone text-xs focus:outline-none focus:border-volt"
                            />
                          ) : (
                            `${p.price} DA`
                          )}
                        </td>
                        <td className="px-4 py-3 text-bone font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                              className="w-20 px-2 py-1 rounded-md bg-white/[0.05] border border-volt/40 text-bone text-xs focus:outline-none focus:border-volt"
                            />
                          ) : (
                            <span className={p.stock <= 5 ? 'text-amber-400 font-bold' : ''}>{p.stock}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEdit(p.uuid)}
                                  disabled={isSavingEdit}
                                  className="p-2 rounded-lg border border-volt/30 bg-volt/10 text-volt hover:bg-volt/20 transition-all cursor-pointer tap-target disabled:opacity-50"
                                  title="Save changes"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={cancelEditing}
                                  className="p-2 rounded-lg border border-white/10 bg-white/[0.02] text-ash hover:text-bone transition-all cursor-pointer tap-target"
                                  title="Cancel"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditing(p)}
                                  className="p-2 rounded-lg border border-white/10 bg-white/[0.02] text-ash hover:text-volt hover:border-volt/30 transition-all cursor-pointer tap-target"
                                  title="Edit stock & price"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
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
                                  {copiedUuid === p.uuid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}