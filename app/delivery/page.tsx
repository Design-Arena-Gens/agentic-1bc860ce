'use client'
import { useState } from 'react'
import { ArrowLeft, Truck, MapPin, Package, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import NotificationCenter from '@/components/Notification'
import { dataStore } from '@/lib/store'

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState('deliveries')
  const [notifications, setNotifications] = useState(dataStore.getNotifications('d1'))

  const allOrders = dataStore.getOrders()
  const myDeliveries = allOrders.filter(o => o.deliveryId === 'd1')
  const availableDeliveries = allOrders.filter(o => o.status === 'processing' && !o.deliveryId)

  const markNotificationRead = (id: string) => {
    dataStore.markNotificationRead(id)
    setNotifications(dataStore.getNotifications('d1'))
  }

  const acceptDelivery = (orderId: string) => {
    dataStore.updateOrder(orderId, { deliveryId: 'd1', status: 'shipped' })
    window.location.reload()
  }

  const updateDeliveryStatus = (orderId: string, status: 'shipped' | 'delivered') => {
    dataStore.updateOrder(orderId, { status })
    window.location.reload()
  }

  const stats = {
    totalDeliveries: myDeliveries.length,
    inProgress: myDeliveries.filter(d => d.status === 'shipped').length,
    completed: myDeliveries.filter(d => d.status === 'delivered').length,
    available: availableDeliveries.length,
  }

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
              <h1 className="text-2xl font-bold text-gray-800">Delivery Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter notifications={notifications} onMarkRead={markNotificationRead} />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Mike Driver</p>
                  <p className="text-xs text-gray-500">Delivery Partner</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  MD
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
              onClick={() => setActiveTab('deliveries')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'deliveries' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Truck className="w-5 h-5" />
              <span className="font-medium">My Deliveries</span>
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'available' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Available Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'map' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Route Map</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'deliveries' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">My Deliveries</h2>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">Total Deliveries</h3>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalDeliveries}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">In Progress</h3>
                  <p className="text-3xl font-bold text-gray-800">{stats.inProgress}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">Completed</h3>
                  <p className="text-3xl font-bold text-gray-800">{stats.completed}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">Available</h3>
                  <p className="text-3xl font-bold text-gray-800">{stats.available}</p>
                </div>
              </div>

              {/* Deliveries List */}
              <div className="space-y-4">
                {myDeliveries.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                    <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-600 mb-4">No active deliveries</p>
                    <button
                      onClick={() => setActiveTab('available')}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      View Available Orders
                    </button>
                  </div>
                ) : (
                  myDeliveries.map(order => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-1">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'shipped' ? 'In Transit' : order.status}
                        </span>
                      </div>

                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-800 mb-1">Delivery Address:</p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.street}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                              {order.shippingAddress.country}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="font-medium text-gray-800 mb-2">Items:</p>
                        <ul className="space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-600">
                              • {item.quantity}x {item.productName}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {order.status === 'shipped' && (
                        <button
                          onClick={() => updateDeliveryStatus(order.id, 'delivered')}
                          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'available' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Available Orders</h2>
              <div className="space-y-4">
                {availableDeliveries.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-16 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">No available orders at the moment</p>
                  </div>
                ) : (
                  availableDeliveries.map(order => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-1">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {order.items.length} items • ${order.total.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Delivery Fee</p>
                          <p className="text-xl font-bold text-orange-600">$15.00</p>
                        </div>
                      </div>

                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-800 mb-1">Delivery Address:</p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.street}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => acceptDelivery(order.id)}
                        className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                      >
                        Accept Delivery
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Route Map</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600 mb-2">Interactive Map View</p>
                    <p className="text-sm text-gray-500">Map integration would display your delivery routes here</p>
                  </div>
                </div>
              </div>

              {myDeliveries.filter(d => d.status === 'shipped').length > 0 && (
                <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">Current Route</h3>
                  <div className="space-y-4">
                    {myDeliveries.filter(d => d.status === 'shipped').map((order, idx) => (
                      <div key={order.id} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-orange-600 font-bold text-sm">{idx + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.street}, {order.shippingAddress.city}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
