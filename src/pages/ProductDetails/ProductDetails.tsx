import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { Share2, Check } from 'lucide-react'

interface Product {
  id: number
  uuid: string
  name: string
  brand?: string
  category?: string
  price: number
  stock: number
  image?: string
}

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>() // This 'id' is the UUID string from the URL
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Fetch product details using the unique UUID route we made earlier
    fetch(`http://localhost:5000/products/uuid/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="bg-ink text-bone min-h-screen flex items-center justify-center">
        <p className="text-xl animate-pulse">Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-ink text-bone min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl">Product not found</p>
        <Link to="/products" className="text-stone-400 underline hover:text-bone">Back to Shop</Link>
      </div>
    )
  }

  return (
    <div className="bg-ink text-bone min-h-screen flex flex-col justify-between">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16 flex-grow grid md:grid-cols-2 gap-12 items-center">
        {/* Product Image */}
        <div className="flex justify-center">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full max-w-sm h-auto object-cover rounded-xl border border-bone/10 shadow-lg"
            />
          ) : (
            <div className="w-64 h-64 bg-stone-900 rounded-xl flex items-center justify-center text-stone-500 border border-bone/10">
              No Image Available
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.brand && <span className="text-stone-400 uppercase tracking-widest text-xs font-semibold">{product.brand}</span>}
            <h1 className="text-4xl font-bold mt-1 tracking-tight">{product.name}</h1>
            {product.category && <span className="inline-block bg-stone-800 text-stone-300 text-xs px-2.5 py-1 rounded-full mt-2">{product.category}</span>}
          </div>

          <div className="border-y border-bone/10 py-4">
            <p className="text-3xl font-bold text-bone">${product.price}</p>
            <p className="text-sm text-stone-400 mt-1">
              Availability: {product.stock > 0 ? `${product.stock} in stock` : <span className="text-red-400">Out of Stock</span>}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={handleShare}
              className={`font-bold px-6 py-3 rounded-lg flex items-center gap-2 active:scale-95 transition-all duration-150 cursor-pointer ${
                copied 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-volt text-ink hover:opacity-90'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Share Product
                </>
              )}
            </button>

            <Link to="/products" className="border border-bone/20 text-bone px-6 py-3 rounded-lg hover:bg-bone/5 active:scale-95 transition-all duration-150">
              Back to Shop
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}