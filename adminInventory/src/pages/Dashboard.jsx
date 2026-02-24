import Layout from '../components/Layout'
import { useInventory } from '../context/InventoryContext'

export default function Dashboard() {
  const { items, loading, error } = useInventory()

  const totalItems = items.length
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

  return (
    <Layout title="Dashboard">
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500">Total Items</h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalItems}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500">Total Quantity</h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalQuantity}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-500">Categories</h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {Array.from(new Set(items.map(item => item.category))).length}
          </p>
        </div>
      </div>
    </Layout>
  )
}
