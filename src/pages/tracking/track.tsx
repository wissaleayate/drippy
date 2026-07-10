import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Package,
  Truck,
  MapPin,
  CreditCard,
  CheckCircle2,
  MessageSquare,
  FileText,
  PhoneCall,
  X,
  Info,
  ChevronRight,
  Check,
} from 'lucide-react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

// Define structures for mock data
interface OrderItem {
  id: string;
  name: string;
  brand: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

interface TimelineStep {
  title: string;
  icon: React.ReactNode;
  description: string;
  timestamp: string;
}

interface MockOrder {
  id: string;
  orderDate: string;
  estDeliveryDate: string;
  shippingAddress: string;
  paymentMethod: string;
  courierName: string;
  trackingNumber: string;
  estArrivalTime: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  totalPrice: number;
  currentStepIndex: number; // 0 to 5
  timeline: TimelineStep[];
  items: OrderItem[];
}

// 3 premium mock orders reflecting different points in the luxury lifecycle
const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'DP-98231',
    orderDate: 'July 08, 2026',
    estDeliveryDate: 'July 12, 2026',
    shippingAddress: '1280 Editorial Way, Apt 4B, New York, NY 10001',
    paymentMethod: 'Apple Pay (•••• 8820)',
    courierName: 'DHL Express',
    trackingNumber: 'DHL-8893-9021',
    estArrivalTime: 'Before 5:00 PM',
    subtotal: 435.00,
    shippingFee: 0.00,
    tax: 34.80,
    totalPrice: 469.80,
    currentStepIndex: 3, // Shipped
    timeline: [
      { title: 'Order Placed', icon: <CheckCircle2 className="w-5 h-5" />, description: 'Order received and logged in system', timestamp: 'July 08, 08:30 AM' },
      { title: 'Payment Confirmed', icon: <CheckCircle2 className="w-5 h-5" />, description: 'Payment authorized and verified', timestamp: 'July 08, 08:32 AM' },
      { title: 'Preparing Order', icon: <Package className="w-5 h-5" />, description: 'Products gathered, quality checked, and boxed', timestamp: 'July 09, 02:15 PM' },
      { title: 'Shipped', icon: <Truck className="w-5 h-5" />, description: 'In transit to local distribution center', timestamp: 'July 10, 09:30 AM' },
      { title: 'Out for Delivery', icon: <MapPin className="w-5 h-5" />, description: 'Out with courier for final mile delivery', timestamp: 'Pending' },
      { title: 'Delivered', icon: <CheckCircle2 className="w-5 h-5" />, description: 'Securely delivered to recipient', timestamp: 'Pending' }
    ],
    items: [
      {
        id: 'shoe-1',
        name: 'NK. Carbon Vapor Prime',
        brand: 'NK. Black Label',
        size: '10',
        quantity: 1,
        price: 290.00,
        image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'shoe-2',
        name: 'Aether Court Prime',
        brand: 'Aether',
        size: '9',
        quantity: 1,
        price: 145.00,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'DP-47209',
    orderDate: 'June 28, 2026',
    estDeliveryDate: 'July 02, 2026',
    shippingAddress: '742 Avenue of Fashion, Los Angeles, CA 90025',
    paymentMethod: 'Visa (•••• 4921)',
    courierName: 'FedEx Premium',
    trackingNumber: 'FDX-7729-1082',
    estArrivalTime: 'Delivered (Signed by Front Desk)',
    subtotal: 320.00,
    shippingFee: 0.00,
    tax: 25.60,
    totalPrice: 345.60,
    currentStepIndex: 5, // Delivered
    timeline: [
      { title: 'Order Placed', icon: <CheckCircle2 className="w-5 h-5" />, description: 'Order received and logged in system', timestamp: 'June 28, 11:10 AM' },
      { title: 'Payment Confirmed', icon: <CheckCircle2 className="w-5 h-5" />, description: 'Payment authorized and verified', timestamp: 'June 28, 11:15 AM' },
      { title: 'Preparing Order', icon: <Package className="w-5 h-5" />, description: 'Quality assurance checked and packed', timestamp: 'June 29, 09:00 AM' },
      { title: 'Shipped', icon: <Truck className="w-5 h-5" />, description: 'Departed sorting facility', timestamp: 'June 30, 04:30 PM' },
      { title: 'Out for Delivery', icon: <MapPin className="w-5 h-5" />, description: 'Courier loaded for local delivery', timestamp: 'July 01, 09:15 AM' },
      { title: 'Delivered', icon: <CheckCircle2 className="w-5 h-5" />, description: 'Handed directly to receptionist', timestamp: 'July 01, 02:40 PM' }
    ],
    items: [
      {
        id: 'shoe-3',
        name: 'Volt Knit Phantom',
        brand: 'NK. Labs',
        size: '11',
        quantity: 1,
        price: 320.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    id: 'DP-10492',
    orderDate: 'July 10, 2026',
    estDeliveryDate: 'July 14, 2026',
    shippingAddress: '88 Minimalist Circle, San Francisco, CA 94107',
    paymentMethod: 'Mastercard (•••• 1084)',
    courierName: 'UPS Ground',
    trackingNumber: 'UPS-1049-2810',
    estArrivalTime: 'Pending Courier Pickup',
    subtotal: 185.00,
    shippingFee: 9.99,
    tax: 14.80,
    totalPrice: 209.79,
    currentStepIndex: 2, // Preparing Order
    timeline: [
      { title: 'Order Placed', icon: <CheckCircle2 className="w-5 h-5" />, description: 'Order received and logged in system', timestamp: 'July 10, 07:15 AM' },
      { title: 'Payment Confirmed', icon: <CheckCircle2 className="w-5 h-5" />, description: 'Payment authorized and verified', timestamp: 'July 10, 07:20 AM' },
      { title: 'Preparing Order', icon: <Package className="w-5 h-5" />, description: 'Items verified, custom shoe tissue wrapping in progress', timestamp: 'July 10, 10:45 AM' },
      { title: 'Shipped', icon: <Truck className="w-5 h-5" />, description: 'Label printed, awaiting carrier dispatch', timestamp: 'Pending' },
      { title: 'Out for Delivery', icon: <MapPin className="w-5 h-5" />, description: 'In transit to final regional hub', timestamp: 'Pending' },
      { title: 'Delivered', icon: <CheckCircle2 className="w-5 h-5" />, description: 'Package drop-off confirmation', timestamp: 'Pending' }
    ],
    items: [
      {
        id: 'shoe-4',
        name: 'Nordic Runner Classic',
        brand: 'Nordic Craft',
        size: '8',
        quantity: 1,
        price: 185.00,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80'
      }
    ]
  }
];

export default function TrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrderId, setActiveOrderId] = useState('DP-98231');
  const [errorMsg, setErrorMsg] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Retrieve current active order
  const activeOrder = MOCK_ORDERS.find(o => o.id.toUpperCase() === activeOrderId.toUpperCase());

  // Handle Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toUpperCase();
    const found = MOCK_ORDERS.find(o => o.id === query || o.trackingNumber.toUpperCase() === query);

    if (found) {
      setActiveOrderId(found.id);
      setErrorMsg('');
    } else {
      setErrorMsg(`No order found matching "${searchQuery}". Try DP-98231, DP-47209, or DP-10492.`);
      // Auto clear error message after 5 seconds
      setTimeout(() => setErrorMsg(''), 6000);
    }
  };

  // Copy tracking number helper
  const handleCopyTracking = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <div className="bg-ink text-bone min-h-screen font-sans flex flex-col selection:bg-volt selection:text-ink">
      {/* Premium Sticky Nav */}
      <Nav />

      {/* Main Container */}
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto w-full">
        
        {/* Page Header - Animated Fade Up */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16 mt-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-volt animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-ash uppercase">Real-Time Shipping</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tight text-bone uppercase mb-4">
            Track Your Order
          </h1>
          <p className="text-sm sm:text-base text-ash max-w-lg mx-auto font-medium">
            Stay updated with your premium order status in real time. Enter your order ID below or click one of our test order presets.
          </p>
        </motion.div>

        {/* Quick Select Presets & Search */}
        <div className="max-w-4xl mx-auto mb-12">
          {/* Search bar wrapper with glassmorphism */}
          <form onSubmit={handleSearch} className="relative mb-6">
            <div className="relative flex items-center bg-white/[0.02] border border-white/10 hover:border-white/20 focus-within:border-volt/50 rounded-2xl p-1.5 transition-all duration-300 backdrop-blur-md">
              <Search className="w-5 h-5 text-ash ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. DP-98231, DP-47209, DP-10492) or Tracking Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 outline-0 py-3 px-4 text-sm sm:text-base text-bone placeholder:text-ash/60 focus:ring-0 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-volt text-ink font-mono font-bold text-xs uppercase px-6 py-3 rounded-xl hover:bg-bone transition-all duration-300 cursor-pointer shadow-lg shadow-volt/10"
              >
                Track
              </button>
            </div>
            {errorMsg && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-4 -bottom-8 text-xs text-rose-400 font-medium"
              >
                {errorMsg}
              </motion.p>
            )}
          </form>

          {/* Presets Grid */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs">
            <span className="text-ash font-mono uppercase tracking-wider text-[10px]">Test Presets:</span>
            {MOCK_ORDERS.map((ord) => {
              const isActive = activeOrderId === ord.id;
              const stepName = ord.timeline[ord.currentStepIndex].title;
              return (
                <button
                  key={ord.id}
                  onClick={() => {
                    setActiveOrderId(ord.id);
                    setSearchQuery('');
                    setErrorMsg('');
                  }}
                  className={`px-4 py-2 rounded-full border font-mono transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                    isActive 
                      ? 'bg-bone text-ink border-bone font-bold shadow-md shadow-white/5' 
                      : 'bg-white/[0.02] text-bone border-white/5 hover:border-white/10 hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{ord.id}</span>
                  <span className="h-1 w-1 rounded-full bg-ash/50" />
                  <span className={`text-[10px] ${isActive ? 'text-ink/80' : 'text-volt'}`}>{stepName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section - Main Details & Timeline */}
        {activeOrder ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-12 items-start">
            
            {/* LEFT SIDE (8 columns on Desktop): Info card, Products Summary, Status Card */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              
              {/* Delivery Status Glow Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 sm:p-8 backdrop-blur-md"
              >
                {/* Decorative background volt ambient light */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-44 h-44 rounded-full bg-volt/10 blur-[60px]" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-ash">Current Status</span>
                    <h2 className="text-2xl sm:text-3xl font-display font-black text-volt uppercase mt-1">
                      {activeOrder.timeline[activeOrder.currentStepIndex].title}
                    </h2>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono uppercase tracking-widest text-ash">Estimated Arrival</span>
                    <p className="text-lg font-bold text-bone font-mono mt-1">
                      {activeOrder.estDeliveryDate}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <span className="text-xs font-mono text-ash uppercase block">Courier</span>
                    <span className="text-sm font-semibold text-bone mt-1 block">{activeOrder.courierName}</span>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-ash uppercase block">Courier Status</span>
                    <span className="text-sm font-semibold text-bone mt-1 block flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      In Transit
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs font-mono text-ash uppercase block">Tracking ID</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold font-mono text-bone">{activeOrder.trackingNumber}</span>
                      <button
                        onClick={() => handleCopyTracking(activeOrder.trackingNumber)}
                        className="p-1.5 rounded-lg bg-white/[0.05] border border-white/5 hover:bg-white/[0.1] text-ash hover:text-bone transition-all cursor-pointer text-xs flex items-center gap-1"
                        title="Copy tracking number"
                      >
                        {copiedTracking ? <span className="text-[10px] text-volt font-bold font-mono">COPIED</span> : <span className="text-[10px] font-mono">COPY</span>}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Order Information Grid Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="h-8 w-8 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
                    <Info className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-wider text-bone">Order Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                  {/* Shipping info */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-mono text-ash uppercase block mb-1">Shipping Address</span>
                      <p className="text-bone leading-relaxed font-medium">
                        {activeOrder.shippingAddress}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-ash uppercase block mb-1">Shipping Service</span>
                      <p className="text-bone font-medium">Standard Secured Fashion Delivery (Signature Required)</p>
                    </div>
                  </div>

                  {/* Payment and Metadata info */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-mono text-ash uppercase block mb-1">Order ID</span>
                        <p className="text-bone font-mono font-bold">{activeOrder.id}</p>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-ash uppercase block mb-1">Order Date</span>
                        <p className="text-bone font-medium">{activeOrder.orderDate}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-mono text-ash uppercase block mb-1">Payment Method</span>
                        <p className="text-bone font-medium flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-ash" />
                          {activeOrder.paymentMethod.replace(' (•••• ', ' ••••')}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-ash uppercase block mb-1">Grand Total</span>
                        <p className="text-volt font-mono font-bold">${activeOrder.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Product Summary Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-volt">
                      <Package className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold font-display uppercase tracking-wider text-bone">
                      Items Summary ({activeOrder.items.reduce((acc, item) => acc + item.quantity, 0)})
                    </h3>
                  </div>
                  <span className="text-xs text-ash font-mono">{activeOrder.id}</span>
                </div>

                {/* Items loop */}
                <div className="divide-y divide-white/5">
                  {activeOrder.items.map((item) => (
                    <div key={item.id} className="py-5 flex gap-4 sm:gap-6 first:pt-0 last:pb-0 group">
                      {/* Product Image */}
                      <div className="h-24 w-20 sm:h-28 sm:w-24 rounded-2xl overflow-hidden bg-zinc border border-white/5 flex-shrink-0 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* Product details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="text-sm sm:text-base font-bold text-bone tracking-tight">
                              {item.name}
                            </h4>
                            <span className="text-sm sm:text-base font-mono font-bold text-bone">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-ash font-medium mt-0.5">{item.brand}</p>
                        </div>
                        
                        {/* Size, Quantity metrics */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-2 border-t border-white/[0.02]">
                          <div className="flex items-center gap-4 text-xs font-mono text-ash">
                            <span className="bg-white/[0.03] px-2 py-1 border border-white/5 rounded-md">
                              SIZE: <span className="text-bone font-bold">{item.size}</span>
                            </span>
                            <span className="bg-white/[0.03] px-2 py-1 border border-white/5 rounded-md">
                              QTY: <span className="text-bone font-bold">{item.quantity}</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-ash font-mono">Item Total: ${item.price.toFixed(2)} ea</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Invoice breakdown summary */}
                <div className="border-t border-white/5 pt-6 space-y-3 text-xs sm:text-sm font-medium">
                  <div className="flex justify-between text-ash">
                    <span>Subtotal</span>
                    <span className="text-bone font-mono">${activeOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-ash">
                    <span>Shipping & Handling</span>
                    <span className="text-bone font-mono">
                      {activeOrder.shippingFee === 0 ? 'FREE' : `$${activeOrder.shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-ash">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-bone font-mono">${activeOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/5 pt-4 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-bone uppercase tracking-wider">Total Paid</span>
                    <span className="text-2xl font-mono font-black text-volt">
                      ${activeOrder.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* RIGHT SIDE (4 columns on Desktop): Timeline tracker & Actions */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-8">
              
              {/* Vertical Order Timeline Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6 sm:p-8"
              >
                <h3 className="text-lg font-bold font-display uppercase tracking-wider text-bone mb-8 border-b border-white/5 pb-4">
                  Shipment Progress
                </h3>

                {/* Timeline vertical layout */}
                <div className="relative pl-1">
                  
                  {/* Animated Background Line connecting the nodes */}
                  <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-white/5" />
                  
                  {/* Colored progress line representing actual shipping progress */}
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ 
                      height: `${(activeOrder.currentStepIndex / (activeOrder.timeline.length - 1)) * 100}%` 
                    }}
                    transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
                    className="absolute left-[22px] top-6 max-h-[88%] w-0.5 bg-volt"
                  />

                  {/* Steps */}
                  <div className="space-y-8 relative">
                    {activeOrder.timeline.map((step, idx) => {
                      const isCompleted = idx < activeOrder.currentStepIndex;
                      const isCurrent = idx === activeOrder.currentStepIndex;
                      const isFuture = idx > activeOrder.currentStepIndex;

                      return (
                        <div key={step.title} className="flex gap-6 items-start relative group">
                          
                          {/* Dot / Icon wrapper */}
                          <div className="relative z-10 flex items-center justify-center">
                            
                            {isCompleted && (
                              <div className="h-[36px] w-[36px] rounded-full bg-volt text-ink flex items-center justify-center shadow-lg shadow-volt/20 ring-4 ring-ink">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </div>
                            )}

                            {isCurrent && (
                              <div className="h-[36px] w-[36px] rounded-full bg-ink text-volt border-2 border-volt flex items-center justify-center ring-4 ring-volt/20 relative">
                                <span className="absolute inset-0 rounded-full border-2 border-volt animate-ping opacity-60" />
                                {step.icon}
                              </div>
                            )}

                            {isFuture && (
                              <div className="h-[36px] w-[36px] rounded-full bg-zinc text-ash border border-white/10 flex items-center justify-center ring-4 ring-ink">
                                <div className="h-2 w-2 rounded-full bg-ash/30" />
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex justify-between items-baseline gap-2">
                              <h4 className={`text-sm sm:text-base font-bold tracking-tight transition-colors duration-300 ${
                                isCurrent ? 'text-volt font-black' : isFuture ? 'text-ash/60' : 'text-bone'
                              }`}>
                                {step.title}
                              </h4>
                              <span className={`text-[10px] font-mono whitespace-nowrap ${
                                isCurrent ? 'text-volt font-semibold' : 'text-ash/50'
                              }`}>
                                {step.timestamp}
                              </span>
                            </div>
                            <p className={`text-xs mt-1 transition-colors duration-300 ${
                              isFuture ? 'text-ash/30' : 'text-ash'
                            }`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Customer Support Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 space-y-4"
              >
                <span className="text-xs font-mono uppercase tracking-widest text-ash block mb-2 text-center">Need Assistance?</span>
                
                {/* Chat Button */}
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-volt/30 text-bone hover:text-volt transition-all duration-300 cursor-pointer flex items-center justify-between text-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-white/[0.05] group-hover:bg-volt/10 flex items-center justify-center text-ash group-hover:text-volt transition-all">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="font-semibold tracking-wide">Live Chat Assistance</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ash group-hover:text-volt transition-transform group-hover:translate-x-1" />
                </button>

                {/* Contact phone button */}
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-volt/30 text-bone hover:text-volt transition-all duration-300 cursor-pointer flex items-center justify-between text-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-white/[0.05] group-hover:bg-volt/10 flex items-center justify-center text-ash group-hover:text-volt transition-all">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <span className="font-semibold tracking-wide">Contact Elite Concierge</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ash group-hover:text-volt transition-transform group-hover:translate-x-1" />
                </button>

                {/* Invoice Button */}
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-volt/30 text-bone hover:text-volt transition-all duration-300 cursor-pointer flex items-center justify-between text-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-white/[0.05] group-hover:bg-volt/10 flex items-center justify-center text-ash group-hover:text-volt transition-all">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-semibold tracking-wide">View Digital Invoice</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ash group-hover:text-volt transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>

            </div>

          </div>
        ) : (
          /* Empty search state fallback if activeOrder gets deleted/unmapped */
          <div className="text-center py-24 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-bone mb-2">Order Not Loaded</h3>
            <p className="text-xs text-ash mb-6">Something went wrong. Please click a preset below to reload an order.</p>
            <button 
              onClick={() => setActiveOrderId('DP-98231')}
              className="px-4 py-2 bg-volt text-ink font-mono text-xs font-bold rounded-lg cursor-pointer"
            >
              Reset to Default Order
            </button>
          </div>
        )}

      </main>

      {/* Footer Area */}
      <Footer />

      {/* 1. Live Chat / Contact Support Modal */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSupportModal(false);
                setSupportSubmitted(false);
              }}
              className="fixed inset-0 bg-ink/80 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative max-w-md w-full bg-zinc border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
            >
              <button
                onClick={() => {
                  setShowSupportModal(false);
                  setSupportSubmitted(false);
                }}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/[0.05] border border-white/5 hover:bg-white/[0.1] text-ash hover:text-bone flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {!supportSubmitted ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-2xl bg-volt/10 text-volt flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-display uppercase text-bone">NK. Concierge</h3>
                      <p className="text-[10px] font-mono text-volt uppercase tracking-wider">Premium Support 24/7</p>
                    </div>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSupportSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-mono text-ash uppercase mb-1.5">Subject</label>
                      <select className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-sm text-bone focus:outline-none focus:border-volt/50 transition-colors">
                        <option value="delivery" className="bg-ink text-bone">Inquire about delivery timeline</option>
                        <option value="address" className="bg-ink text-bone">Modify delivery details</option>
                        <option value="damaged" className="bg-ink text-bone">Damaged or missing items</option>
                        <option value="returns" className="bg-ink text-bone">Exchange / Return procedures</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-ash uppercase mb-1.5">Order Reference</label>
                      <input
                        type="text"
                        defaultValue={activeOrder?.id || ''}
                        disabled
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-sm text-ash font-mono focus:outline-none cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-ash uppercase mb-1.5">Message</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Detail your request. Our representative will respond within 5 minutes..."
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-sm text-bone placeholder:text-ash/40 focus:outline-none focus:border-volt/50 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 mt-2 bg-volt text-ink font-mono font-bold uppercase text-xs rounded-xl hover:bg-bone transition-all duration-300 cursor-pointer shadow-lg shadow-volt/5"
                    >
                      Start Session
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="h-14 w-14 rounded-full bg-volt/10 text-volt flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold font-display uppercase text-bone mb-2">Concierge Connected</h3>
                  <p className="text-xs text-ash leading-relaxed mb-6">
                    Your request has been dispatched. A customer support representative will reach out shortly or join this channel within 2 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setShowSupportModal(false);
                      setSupportSubmitted(false);
                    }}
                    className="px-6 py-3 border border-white/10 hover:border-white/25 text-bone text-xs font-mono uppercase rounded-xl transition-all cursor-pointer bg-white/[0.01]"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Digital Luxury Invoice Modal */}
      <AnimatePresence>
        {showInvoiceModal && activeOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInvoiceModal(false)}
              className="fixed inset-0 bg-ink/90 backdrop-blur-sm"
            />

            {/* Invoice Printable Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-w-2xl w-full bg-white text-zinc-900 rounded-3xl p-6 sm:p-10 shadow-2xl z-10 overflow-hidden print:p-0 print:border-none"
            >
              {/* Close Button - hidden in print */}
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="absolute top-6 right-6 h-8 w-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center cursor-pointer transition-all print:hidden"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Invoice Logo & Header */}
              <div className="flex justify-between items-start border-b border-zinc-100 pb-6 mb-6">
                <div>
                  <h2 className="font-display font-black text-3xl tracking-tight text-zinc-950 uppercase">
                    NK<span className="text-volt">.</span>
                  </h2>
                  <p className="text-xs font-mono text-zinc-400 mt-1">Drippy Luxury Footwear Ltd.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Receipt / Invoice</span>
                  <span className="text-lg font-mono font-bold text-zinc-900 block mt-1">{activeOrder.id}</span>
                </div>
              </div>

              {/* Billing and shipping information */}
              <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
                <div>
                  <span className="font-mono text-zinc-400 uppercase block mb-1">Prepared For</span>
                  <p className="font-bold text-zinc-900">Valued Drippy Patron</p>
                  <p className="text-zinc-500 mt-1 leading-relaxed">{activeOrder.shippingAddress}</p>
                </div>
                <div className="text-right">
                  <div className="space-y-2">
                    <div>
                      <span className="font-mono text-zinc-400 uppercase block">Invoice Date</span>
                      <span className="font-bold text-zinc-900 mt-0.5 block">{activeOrder.orderDate}</span>
                    </div>
                    <div>
                      <span className="font-mono text-zinc-400 uppercase block">Payment Channel</span>
                      <span className="font-bold text-zinc-900 mt-0.5 block">{activeOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs mb-8">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 font-mono uppercase">
                    <th className="pb-3">Item Details</th>
                    <th className="pb-3 text-center">Size</th>
                    <th className="pb-3 text-center">Qty</th>
                    <th className="pb-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {activeOrder.items.map((it) => (
                    <tr key={it.id} className="text-zinc-800">
                      <td className="py-4">
                        <p className="font-bold text-zinc-900">{it.name}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{it.brand}</p>
                      </td>
                      <td className="py-4 text-center font-mono">{it.size}</td>
                      <td className="py-4 text-center font-mono">{it.quantity}</td>
                      <td className="py-4 text-right font-mono font-semibold">${it.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total calculations */}
              <div className="border-t border-zinc-100 pt-6 flex flex-col items-end text-xs sm:text-sm font-medium">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-zinc-900 font-mono">${activeOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="text-zinc-900 font-mono">
                      {activeOrder.shippingFee === 0 ? 'FREE' : `$${activeOrder.shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-zinc-900 font-mono">${activeOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-zinc-200 pt-3 mt-1 flex justify-between items-baseline font-bold text-zinc-900">
                    <span className="uppercase text-xs tracking-wider">Grand Total</span>
                    <span className="text-xl font-mono text-zinc-950">${activeOrder.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Invoice footer terms */}
              <div className="border-t border-zinc-100 pt-8 mt-8 text-center text-[10px] text-zinc-400 font-mono">
                <p>Thank you for shopping at NK. / Drippy. All sales are final on select high-heat limited collections.</p>
                <p className="mt-1">For support, call 1-800-DRIPPY-NK or email support@drippyfootwear.com</p>
              </div>

              {/* Print buttons - hidden in print */}
              <div className="mt-8 flex justify-center gap-4 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-zinc-900 text-white font-mono font-bold text-xs uppercase rounded-xl hover:bg-zinc-800 transition-all cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Print Receipt
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-6 py-3 border border-zinc-200 text-zinc-500 font-mono text-xs uppercase rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-all cursor-pointer"
                >
                  Return to Tracking
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
