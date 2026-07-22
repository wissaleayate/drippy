import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Package, Mail, LogOut, UserCircle2, Calendar, MapPin, Save, Heart, Trash2 } from 'lucide-react';
import { useAuth, type SavedDeliveryInfo } from '../../context/AuthContext';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

interface ApiProduct {
  uuid: string;
  name: string;
  brand: string;
  price: number;
  image?: string;
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

// ─── Placeholder order data ────────────────────────────────────────────────
// TODO (backend): replace this with a real fetch to the backend once orders
// are tied to logged-in accounts, e.g.:
//   fetch(`http://127.0.0.1:5000/orders/user/${user.id}`)
interface ProfileOrder {
  id: string;
  date: string;
  status: string;
  total: string;
  itemCount: number;
}

const PLACEHOLDER_ORDERS: ProfileOrder[] = [
  { id: '—', date: '—', status: 'No orders yet', total: '—', itemCount: 0 },
];

const STATUS_COLORS: Record<string, string> = {
  Nouveau: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  Confirmé: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Ne répond pas': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Expédiée: 'bg-volt/10 text-volt border-volt/20',
};

export default function ProfilePage() {
  const { user, logout, updateDeliveryInfo, toggleWishlist, updateAccountInfo } = useAuth();

  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [accountMsg, setAccountMsg] = useState('');
  const [accountMsgIsError, setAccountMsgIsError] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);

  const [wishlistProducts, setWishlistProducts] = useState<ApiProduct[]>([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);

  useEffect(() => {
    if (!user?.wishlist || user.wishlist.length === 0) {
      setWishlistProducts([]);
      setIsLoadingWishlist(false);
      return;
    }
    setIsLoadingWishlist(true);
    fetch('http://127.0.0.1:5000/products')
      .then((res) => res.json())
      .then((data: ApiProduct[]) => {
        const matched = data.filter((p) => user.wishlist!.includes(p.uuid));
        setWishlistProducts(matched);
      })
      .catch((err) => console.error('Failed to load wishlist products:', err))
      .finally(() => setIsLoadingWishlist(false));
  }, [user?.wishlist]);

  const [recentProducts, setRecentProducts] = useState<ApiProduct[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  useEffect(() => {
    setIsLoadingRecent(true);
    let recentIds: string[] = [];
    try {
      recentIds = JSON.parse(localStorage.getItem('drippy_recently_viewed') ?? '[]');
    } catch {
      recentIds = [];
    }
    if (recentIds.length === 0) {
      setRecentProducts([]);
      setIsLoadingRecent(false);
      return;
    }
    fetch('http://127.0.0.1:5000/products')
      .then((res) => res.json())
      .then((data: ApiProduct[]) => {
        const byId = new Map(data.map((p) => [p.uuid, p]));
        const ordered = recentIds.map((id) => byId.get(id)).filter(Boolean) as ApiProduct[];
        setRecentProducts(ordered);
      })
      .catch((err) => console.error('Failed to load recently viewed products:', err))
      .finally(() => setIsLoadingRecent(false));
  }, []);

  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'pickup'>('home');
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    if (user?.deliveryInfo) {
      setPhone(user.deliveryInfo.phone ?? '');
      setAddress(user.deliveryInfo.address ?? '');
      setWilaya(user.deliveryInfo.wilaya ?? '');
      setDeliveryType(user.deliveryInfo.deliveryType ?? 'home');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user?.name, user?.email]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSaveDeliveryInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const info: SavedDeliveryInfo = { phone, address, wilaya, deliveryType };
    updateDeliveryInfo(info);
    setSavedMsg('Saved! This will be used to pre-fill your checkout.');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleSaveAccountInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const result = updateAccountInfo(editName, editEmail);
    if (result.success) {
      setAccountMsgIsError(false);
      setAccountMsg('Account info updated.');
      setIsEditingAccount(false);
    } else {
      setAccountMsgIsError(true);
      setAccountMsg(result.error ?? 'Something went wrong.');
    }
    setTimeout(() => setAccountMsg(''), 4000);
  };

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // TODO (backend): swap this placeholder for real order data once available
  const orders = PLACEHOLDER_ORDERS;
  const hasRealOrders = orders.length > 0 && orders[0].id !== '—';

  return (
    <div className="min-h-screen flex flex-col bg-ink text-bone">
      <Nav />
      <main className="flex-grow pt-28 pb-24 max-w-4xl mx-auto px-4 sm:px-6 w-full">
        {/* Account Info Card */}
        <section className="mb-10 p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
          {!isEditingAccount ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-volt text-2xl font-black text-ink select-none">
                {initials}
              </span>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-black font-display uppercase tracking-tight text-bone truncate">
                  {user.name}
                </h1>
                <p className="text-sm text-ash flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEditingAccount(true)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-volt/30 hover:text-volt text-ash text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-rose-400/30 hover:text-rose-400 text-ash text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveAccountInfo} className="flex flex-col gap-4">
              <div className="flex items-center gap-6">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-volt text-2xl font-black text-ink select-none">
                  {initials}
                </span>
                <div className="flex-1 flex flex-col gap-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
                  />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingAccount(false);
                    setEditName(user.name);
                    setEditEmail(user.email);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-ash text-xs font-bold uppercase tracking-wider hover:text-bone transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          {accountMsg && (
            <p className={`text-xs font-semibold mt-4 ${accountMsgIsError ? 'text-rose-400' : 'text-volt'}`}>
              {accountMsg}
            </p>
          )}
        </section>
        {/* Saved Delivery Info */}
        <section className="mb-10" aria-labelledby="delivery-info-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
              <MapPin className="w-4 h-4" />
            </div>
            <h2 id="delivery-info-heading" className="text-xl font-bold font-display uppercase tracking-wider text-bone">
              Saved Delivery Info
            </h2>
          </div>

          <form onSubmit={handleSaveDeliveryInfo} className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={15}
              className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
            />
            <select
              value={wilaya}
              onChange={(e) => setWilaya(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone focus:outline-none focus:border-volt/50"
            >
              <option value="" className="bg-zinc">Select your wilaya</option>
              {ALGERIA_WILAYAS.map((w) => (
                <option key={w} value={w} className="bg-zinc">{w}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="sm:col-span-2 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-bone placeholder:text-ash focus:outline-none focus:border-volt/50"
            />
            <div className="sm:col-span-2 flex gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('home')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  deliveryType === 'home' ? 'bg-volt border-volt text-ink' : 'bg-white/[0.03] border-white/10 text-bone hover:border-white/20'
                }`}
              >
                Home Delivery
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  deliveryType === 'pickup' ? 'bg-volt border-volt text-ink' : 'bg-white/[0.03] border-white/10 text-bone hover:border-white/20'
                }`}
              >
                Pickup Point
              </button>
            </div>

            {savedMsg && <p className="sm:col-span-2 text-xs font-semibold text-volt">{savedMsg}</p>}

            <button
              type="submit"
              className="sm:col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Delivery Info
            </button>
          </form>
        </section>
        
        {/* Wishlist */}
        <section className="mb-10" aria-labelledby="wishlist-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
              <Heart className="w-4 h-4" />
            </div>
            <h2 id="wishlist-heading" className="text-xl font-bold font-display uppercase tracking-wider text-bone">
              Wishlist ({wishlistProducts.length})
            </h2>
          </div>

          {isLoadingWishlist ? (
            <p className="text-sm text-ash">Loading...</p>
          ) : wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
              <Heart className="w-8 h-8 text-ash/30 mb-3" />
              <h3 className="text-sm font-bold text-bone mb-1">No saved items yet</h3>
              <p className="text-xs text-ash mb-5">Tap the heart on any product to save it here.</p>
              <Link
                to="/products"
                className="px-4 py-2.5 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {wishlistProducts.map((p) => (
                <div key={p.uuid} className="group relative rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]">
                  <Link to={`/products/uuid/${p.uuid}`} className="block">
                    <div className="aspect-square bg-[#221407]">
                      {p.image && (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-ash uppercase tracking-wider truncate">{p.brand}</p>
                      <p className="text-sm font-bold text-bone truncate">{p.name}</p>
                      <p className="text-sm font-mono text-volt mt-1">{p.price?.toLocaleString()} DA</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleWishlist(p.uuid)}
                    aria-label={`Remove ${p.name} from wishlist`}
                    className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-ink/70 backdrop-blur-md border border-white/10 text-ash hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Recently Viewed */}
        {(isLoadingRecent || recentProducts.length > 0) && (
          <section className="mb-10" aria-labelledby="recent-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 id="recent-heading" className="text-xl font-bold font-display uppercase tracking-wider text-bone">
                Recently Viewed
              </h2>
            </div>

            {isLoadingRecent ? (
              <p className="text-sm text-ash">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {recentProducts.map((p) => (
                  <Link
                    key={p.uuid}
                    to={`/products/uuid/${p.uuid}`}
                    className="block rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01] hover:border-volt/30 transition-all"
                  >
                    <div className="aspect-square bg-[#221407]">
                      {p.image && (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-bold text-bone truncate">{p.name}</p>
                      <p className="text-xs font-mono text-volt mt-0.5">{p.price?.toLocaleString()} DA</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Order History */}
        <section aria-labelledby="orders-heading"></section>

        {/* Order History */}
        <section aria-labelledby="orders-heading"></section>
        {/* Order History */}
        <section aria-labelledby="orders-heading"></section>
        {/* Order History */}
        <section aria-labelledby="orders-heading">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
              <Package className="w-4 h-4" />
            </div>
            <h2 id="orders-heading" className="text-xl font-bold font-display uppercase tracking-wider text-bone">
              Order History
            </h2>
          </div>

          {hasRealOrders ? (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-ash">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-bone">Order #{order.id}</p>
                      <p className="text-xs text-ash flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {order.date} · {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_COLORS[order.status] ?? 'bg-white/[0.04] text-ash border-white/10'}`}>
                      {order.status}
                    </span>
                    <span className="text-sm font-bold text-bone font-mono">{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
              <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-ash mb-5">
                <UserCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-bone mb-2">No orders yet</h3>
              <p className="text-sm text-ash leading-relaxed max-w-sm mb-6">
                When you place an order, it'll show up here so you can track it anytime.
              </p>
              <Link
                to="/products"
                className="px-5 py-3 rounded-xl bg-volt text-ink text-xs font-mono font-bold uppercase tracking-wider hover:bg-bone transition-all cursor-pointer"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}