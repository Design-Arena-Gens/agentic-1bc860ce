'use client'
import { useState } from 'react'
import { ArrowLeft, ShoppingCart, Heart, Search, Filter, Star } from 'lucide-react'
import Link from 'next/link'
import { dataStore } from '@/lib/store'

export default function CustomerPage() {
  const [activeTab, setActiveTab] = useState('browse')
  const [cart, setCart] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const products = dataStore.getProducts()
  const categories = dataStore.getCategories()
  const myOrders = dataStore.getOrders().filter(o => o.customerId === 'c1')

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (product: any) => {
    setCart([...cart, product])
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Shop</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('cart')}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Bob Customer</p>
                  <p className="text-xs text-gray-500">Customer</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  BC
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'browse' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="font-medium">Browse</span>
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'cart' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Cart ({cart.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'orders' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">My Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'wishlist' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="font-medium">Wishlist</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'browse' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Browse Products</h2>

              {/* Search and Filters */}
              <div className="mb-6 flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative">
                      <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
                      {product.comparePrice && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                        </div>
                      )}
                      <button className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                        <span className="text-xs text-gray-600 ml-1">(4.0)</span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                        {product.comparePrice && (
                          <span className="text-sm text-gray-400 line-through">${product.comparePrice}</span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cart' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h2>
              {cart.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex gap-4">
                          <img src={item.images[0]} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-gray-900">${item.price}</span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal ({cart.length} items)</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span>$10.00</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Tax</span>
                          <span>${(cartTotal * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between text-lg font-bold text-gray-800">
                            <span>Total</span>
                            <span>${(cartTotal + 10 + cartTotal * 0.1).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h2>
              <div className="space-y-4">
                {myOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.createdAt.toLocaleDateString()}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-gray-700">{item.quantity}x {item.productName}</span>
                          <span className="text-gray-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-800">Total</span>
                        <span className="text-lg font-bold text-gray-800">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">My Wishlist</h2>
              <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600 mb-4">Your wishlist is empty</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Browse Products
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
